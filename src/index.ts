import express from 'express';
import path from 'path';
import cors from 'cors';
import WebSocket from 'ws';

const app = express();
const PORT = 3005;

app.use(cors());

app.use(express.static(path.join(__dirname, '../client/build')));

const server = app.listen(PORT, () => {
    console.log(`Server is listening at ${PORT}`);
})

const wss = new WebSocket.Server({ server });

wss.on('connection', (ws) => {
    ws.on('message', (msg) => {
        console.log(`recieved message: ${msg}`);
    });

    ws.send('sent msg');
})