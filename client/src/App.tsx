import React, { useState, useEffect } from 'react';
import './App.css';

const App = () => {
  const [username, setUsername] = useState('');

  useEffect(() => {

    const HOST = window.location.origin.replace(/^http/, 'ws');
    const ws = new WebSocket(HOST);

    ws.onopen = () => {
      console.log('websocket is connected');
      ws.send("hello server");
    };

  }, []);

  return (
    <div className="App">
      <input type="text" value={username} onChange={(e) => {setUsername(e.target.value)}}></input>
      <button>Create Room</button>
      <button>Join Room</button>
      <div>{username}</div>
    </div>
  );
}

export default App;
