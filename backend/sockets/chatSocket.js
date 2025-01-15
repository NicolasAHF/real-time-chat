const { insertMessage, getMessagesByRoom } = require('../models/messageModel');
const { ObjectId } = require('mongodb');

let onlineUsers = {};

function chatSocket(io){
    io.on('connection', (socket) => {
        console.log('User connected: ', socket.id);

        socket.on('setUsername', (username) => {
            onlineUsers[socket.id] = { username };
            io.emit('onlineUsers', Object.values(onlineUsers));
        });

        socket.on('joinRoom', async (room) => {
            socket.join(room);
            console.log(`Usuario ${socket.id} se unió a la sala: ${room}`);

            const messages = await getMessagesByRoom(room);
            socket.emit('chatHistory', messages);
        });

        socket.on('sendMessage', async (data) => {
            try{
                const { username, text, room } = data;
                const newMessage = {
                    username,
                    text,
                    room,
                    timestamp: new Date()
                };

                const insertedId = await insertMessage(newMessage);
                newMessage._id = insertedId;

                io.to(room).emit('newMessage', newMessage);
            }catch(error){
                console.error('Error while saving the message', error);
            }
        });

        socket.on('privateMessage', (data) => {
            const targetSocketId = data.toSocketId;
            io.to(targetSocketId).emit('privateMessage', {
                from: socket.id,
                text: data.text
            });
        });

        socket.on('disconnect', () => {
            console.log('Usuario desconectado:', socket.id);
            delete onlineUsers[socket.id];
            io.emit('onlineUsers', Object.values(onlineUsers));
        });
    });
}

module.exports = chatSocket;