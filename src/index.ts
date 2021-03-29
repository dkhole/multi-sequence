import express from 'express';
import path from 'path';
import cors from 'cors';
import WebSocket from 'ws';
import { nanoid } from 'nanoid';

const app = express();
const PORT = 3005;

app.use(cors());

app.use(express.static(path.join(__dirname, '../client/build')));

const server = app.listen(PORT, () => {
    console.log(`Server is listening at ${PORT}`);
})

const wss = new WebSocket.Server({ server });

let rooms: any = [];

wss.on('connection', (ws) => {
    ws.on('message', (msg: string) => {
        
        const data = JSON.parse(msg);

        if(data.type === 'create') {
            //create uuid and room object
            const room = {
                id: nanoid(10),
                user1: ws,
                user1_id: data.username,
                user2: null,
                user2_id: ''
            }

            rooms.push(room);

            const res = {
                type: 'roomId',
                value: room.id.toString()
            }

            ws.send(JSON.stringify(res));
            console.log(rooms);
        }

        if(data.type === 'join') {
            let found = false;
            let findRoom;
            //search for roomid and add user if found
            for(const room of rooms) {
                if(room.id === data.roomId) {
                    room.user2 = ws;
                    room.user2_id = data.username;
                    found = true;
                    findRoom = room;
                }
            }

            if(found) {
                const res = {
                    type: 'found',
                    user1_id: findRoom.user1_id,
                    user2_id: findRoom.user2_id,
                }
                ws.send(JSON.stringify(res));

                for(const room of rooms) {
                    if(room.user1 && room.user2) {
                        room.user1.send(JSON.stringify({status: 'connected'}));
                        room.user2.send(JSON.stringify({status: 'connected'}));
                        console.log('broadcasted to room');
                    }
                }
            } else {
                const res = {
                    type: 'invalid id',
                }
                ws.send(JSON.stringify(res));
            }
        }
    });
})

