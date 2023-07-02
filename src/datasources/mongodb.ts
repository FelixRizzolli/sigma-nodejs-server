import { MongoClient } from 'mongodb';
import dotenv from 'dotenv';

dotenv.config();
const URI = process.env.MONGODB_URI;
const options = {};

if (!URI) throw new Error('Invalid/Missing environment variable: "MONGODB_URI"');

let mongoClient: MongoClient = new MongoClient(URI, options);

let dbConnection;

export const connectToDatabase = (callback) => {
    mongoClient.connect()
        .then((client) => {
            dbConnection = client.db();
            return callback();
        })
        .catch((error) => {
            console.log(error);
            return callback(error);
        })
}

export const getDatabase = () => dbConnection;