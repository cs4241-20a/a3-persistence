import mongodb from "mongodb";
import dotenv from "dotenv";

dotenv.config({
    path: "../.env"
});

const MONGODB_URI = `mongodb+srv://${process.env.USER}:${process.env.PASS}@${process.env.HOST}/${process.env.DB}`;

const mongoClient = new mongodb.MongoClient(MONGODB_URI, {useNewUrlParser: true, useUnifiedTopology: true});

const connectionPromise = mongoClient.connect();

export async function getCollection(name) {
    await connectionPromise;
    const db = mongoClient.db('db');
    const collection = db.collection(name);
    if (collection) return collection;
    return await db.createCollection(name);
}