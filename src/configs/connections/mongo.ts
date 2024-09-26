import mongoose from 'mongoose';
import { MONGO_CONNECTION_URI } from '../envs';

export const connectionMongo = mongoose.createConnection(MONGO_CONNECTION_URI);

connectionMongo.on('error', (err) => {
  console.error('MongoDB connection error:', err);
});

connectionMongo.once('open', () => {
  console.log('MongoDB connection established.');
});

connectionMongo.on('disconnected', () => {
  console.log('MongoDB connection disconnected.');
});