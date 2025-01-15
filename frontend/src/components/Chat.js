import React, { useState, useEffect } from 'react';
import io from 'socket.io-client';

const socket = io('https://opulent-couscous-55564qqj75qfvw7g-4000.app.github.dev/');

function Chat(){
    const [username, setUsername] = useState('');
    const [text, setText] = useState('');
    const [messages, setMessages] = useState([]);

    useEffect(() => {
        socket.on('chatHistory', (history) =>{
            setMessages(history);
        })

        socket.on('newMessage', (newMsg) =>{
            setMessages((prev) => [...prev, newMsg]);
        });

        return () => {
            socket.off('chatHistory');
            socket.off('newMessage');
        }
    }, []);

    const handleSendMessage = (e) => {
        e.preventDefault();
        if(username.trim() && text.trim()){
            socket.emit('sendMessage', {
                username,
                text
            });
            setText('');
        }
    };

    return (
        <div style={{maxWidth: '600px', margin: '0 auto'}}>
            <h2>Real Time Chat</h2>
            <div style={{marginBottom: '1rem'}}>
                <label>Username</label>
                <input 
                    type='text'
                    value={username}
                    onChange={(e) => setUsername(e.target.value)}
                    placeholder='Enter your name'
                />
            </div>

            <div style={{border: '1px solid #ccc', height: '300px', overflow: 'auto', marginBottom: '1rem'}}>
                {messages.map((msg) => (
                    <div key={msg._id}>
                        <strong>{msg.username}</strong> {msg.text}
                    </div>
                ))}
            </div>

            <form onSubmit={handleSendMessage}>
                <input 
                    type='text'
                    value={text}
                    onChange={(e) => setText(e.target.value)}
                    placeholder='Write message'
                />
                <button type='submit'>Send</button>
            </form>
        </div>
    );
}

export default Chat;