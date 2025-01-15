const express = require('express');
const router = express.Router();
const authMiddleware = require('../middleware/authMiddleware');
const { getMessages, uploadFile, addReaction } = require('../controllers/chatController');

router.get('/messages', authMiddleware, getMessages);

router.post('/upload', authMiddleware, uploadFile);

router.post('/reactions', authMiddleware, addReaction);

module.exports = router;
