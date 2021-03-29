import React, { useState } from 'react';
import './App.css';

const App = () => {
  const [username, setUsername] = useState('');
  const [roomId, setRoomId] = useState('');
  const [inputRoom, setInputRoom] = useState('');

  const createRoom = () => {
    //const HOST = window.location.origin.replace(/^http/, 'ws');
    const ws = new WebSocket('ws://localhost:3005/');

    ws.onopen = () => {
      const userInfo = {
        type: 'create',
        username: username,
      }
      ws.send(JSON.stringify(userInfo));
    };

    ws.onmessage = (msg: any) => {
      const data = JSON.parse(msg.data);
      console.log(msg);
      if(data.type === 'roomId') {
        setRoomId(data.value);
      }
    }
  };

  const joinRoom = () => {
    const ws = new WebSocket('ws://localhost:3005/');

    ws.onopen = () => {
      const userInfo = {
        type: 'join',
        username: username,
        roomId: inputRoom
      }
      ws.send(JSON.stringify(userInfo));
    };

    ws.onmessage = (msg: any) => {
      const data = JSON.parse(msg.data);
      console.log(msg);
      if(data.type === 'found') {
        console.log('found');
      } else {
        console.log('lost');
      }
    };
  }

  return (
    <div className="App">
      <input type="text" value={username} onChange={(e) => {setUsername(e.target.value)}}></input>
      <button onClick={createRoom}>Create Room</button>
      <input type="text" value={inputRoom} onChange={(e) => {setInputRoom(e.target.value)}}></input>
      <button onClick={joinRoom}>Join Room</button>
      <div>{username}</div>
      <div>{roomId}</div>
    </div>
  );
}

export default App;
