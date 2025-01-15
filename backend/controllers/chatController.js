const multer = require('multer');
const path = require('path');
const {
    insertMessage,
    getAllMessages,
    addReactionToMessage
} = require('../models/messageModel');

const storage = multer.diskStorage({
    destination: (req, file, cb) => {
        cb(null, path.join(__dirname, '..', 'uploads'));
    },
    filename: (req, file, cb) => {
        const uniqueSuffix = Date.now() + '-' + Math.round(Math.random() * 1E9);
        cb(null, uniqueSuffix + '-' + file.originalname);
    }
});

const upload = multer({ storage });

exports.getMessages = async (req, res) => {
    try{
        const messages = await getAllMessages();
        return res.json(messages);
    }catch (error){
        console.error('Error getMessages:', error);
        res.status(500).json({ error: 'Error interno' });
    }
}

exports.uploadFile = [
    upload.single('file'),
    async (req, res) => {
        if(!req.file){
            return res.status(400).json({ error: 'No file uploaded'});
        }

        return res.status(200).json({
            message:'File uploaded',
            filePath: `/uploads/${req.file.filename}`
        });
    }
];

exports.addReaction = async (req, res) => {
    try{
        const { messageId, reactionType } = req.body;
        const userId = req.user.userId;
        await addReactionToMessage(messageId, userId, reactionType);
        return res.json({ message: 'Reaction added'});
    }catch(error){
        console.error('Error addReaction:', error);
        res.status(500).json({ error: 'Error interno' });
    }
}