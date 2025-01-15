require('dotenv').config();
const { MongoClient } = require('mongodb');

let dbClient;

async function connectDB(){
    try{
        if(!dbClient){
            dbClient= new MongoClient(process.env.MONGODB_URI, {
                useUnifiedTopology: true,
            });

            await dbClient.connect();
            console.log('Connected to MongoDB Atlas');

        }
        return dbClient;
    }catch(error){
        console.error('Connection to MongoDB failed', error);
        process.exit(1);
    }
}

module.exports = {connectDB};