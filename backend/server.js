require('dotenv').config();


const express = require('express');
const http = require('http');
const socketIO = require('socket.io');
const cors = require('cors');
const morgan = require('morgan');
const { connectDB } = require('./config/db');
const chatSocket = require('./sockets/chatSocket');

const authRoutes = require('./routes/authRoutes');
const chatRoutes = require('./routes/chatRoutes');

const app = express();
const server = http.createServer(app);

app.use(morgan('dev'));
app.use(cors({
    origin: '*', 
    methods: ['GET', 'POST', 'PUT', 'DELETE']
}));
app.use(express.json());

app.use('/uploads', express.static('uploads'));

app.use('/api/auth', authRoutes);
app.use('/api/chat', chatRoutes);

app.get('/', (req, res) => {
    res.send('Servidor de Chat funcionando con múltiples features.');
});

const io = socketIO(server, {
    cors: {
        origin: '*',
        methods: ['GET', 'POST']
    }
});

connectDB()
    .then(() => {
        chatSocket(io);

        const PORT = process.env.PORT || 4000;
        server.listen(PORT, () => {
            console.log(`Servidor escuchando en el puerto ${PORT}`);
        });
    })
    .catch((err) => {
        console.error('Error al conectar DB:', err);
        process.exit(1);
    });
