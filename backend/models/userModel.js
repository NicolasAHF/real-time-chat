const { ObjectId } = require('mongodb');
const { connectDB } = require('../config/db');

async function createUser({ username, hashedPassword}){
    const client = await connectDB();
    const db = client.db('real-time-chat');
    const userColl = db.collection('users');
    const result = await userColl.insertOne({
        username,
        password: hashedPassword,
        createdAt: new Date()
    });
    return result.insertedId;
}

async function findUserByUsername(username) {
    const client = await connectDB();
    const db = client.db('real-time-chat');
    const userColl = db.collection('users');
    const user = await userColl.findOne({ username });

    return user;
}

async function findUserById(id){
    const client = await connectDB();
    const db = client.db('real-time-chat');
    const userColl = db.collection('users');
    const user = await userColl.findOne({ _id: new ObjectId(id) });

    return user;
}


module.exports = {
    createUser,
    findUserById,
    findUserByUsername
}