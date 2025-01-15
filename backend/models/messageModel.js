const { ObjectId } = require('mongodb');
const { connectDB } = require('../config/db');

async function insertMessage(messageData){
    const client = await connectDB();
    const db = client.db('real-time-chat');
    const messagesColl = db.collection('messages');

    const result = await messagesColl.insertOne(messageData);

    return result.insertedId;
}

async function getMessagesByRoom(roomName){
    const client = await connectDB();
    const db = client.db('real-time-chat');
    const messagesColl = db.collection('messages');

    const messages = await messagesColl
        .find({ room: roomName})
        .sort({ timestamp: 1})
        .toArray();
    
    return messages;
}

async function getAllMessages(){
    const client = await connectDB();
    const db = client.db('real-time-chat');
    const messagesColl = db.collection('messages');

    const messages = await messagesColl
        .find({})
        .sort({ timestamp: 1})
        .toArray();
    
    return messages;
}

async function addReactionToMessage(messageId, userId, reactionType){
    const client = await connectDB();
    const db = client.db('real-time-chat');
    const messagesColl = db.collection('messages');

    await messagesColl.updateOne(
        {_id: new ObjectId(messageId) },
        { $push: { reactions: { userId, type: reactionType } } }
    );
}

module.exports = {
    insertMessage,
    getAllMessages,
    getMessagesByRoom,
    addReactionToMessage
};