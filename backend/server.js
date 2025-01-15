require('dotenv').config();

const express = require('express');
const http = require('http');
const socketIO = require('socket.io');
const cors = require('cors');
const { connectDB } = require('./config/db');

const app = express();

const server = http.createServer(app);

app.use(cors({
    origin: '*', 
    methods: ['GET', 'POST']
  }));

const io = socketIO(server, {
    cors: {
        origin: '*',
        methods: ['GET', 'POST']
    }
});


app.use(express.json());

app.get('/', (req, res) => {
    res.send('Server is working fine');
});

io.on('connection', async (socket) => {
    console.log('User connected: ', socket.id);

    try{
        const client = await connectDB();
        const db = client.db('real-time-chat');
        const messageCollection = db.collection('messages');

        const messages = await messageCollection
            .find({})
            .sort({ timestamp: 1})
            .toArray();
        
        socket.emit('chatHistory', messages);

        socket.on('sendMessage', async (data) => {
            try{
                const newMessage = {
                    username: data.username,
                    text: data.text,
                    timestamp: new Date()
                };

                const result = await messageCollection.insertOne(newMessage);

                newMessage._id = result.insertedId;

                io.emit('newMessage', newMessage);
            }catch (error){
                console.error('Error while saving the message', error);
            }
        });

        socket.on('disconnect', () => {
            console.log('Used disconnected', socket.id);
        });
    }catch (error){
        console.error('Connection with Socket.IO failed', error);
    }
});

const PORT = process.env.PORT || 4000;
server.listen(PORT, () => {
    console.log(`Server listening on port ${PORT}`);
})