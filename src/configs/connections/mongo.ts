import mongoose from 'mongoose';
import { MONGO_CONNECTION_NOTIFICATION_URI, MONGO_CONNECTION_ACCOUNT_URI } from '../envs';

const createMongoConnection = (uri: string, dbName: string) => {
  const connection = mongoose.createConnection(uri);

  connection.on('error', (err) => {
    console.error(`MongoDB connection error [${dbName}]:`, err);
  });

  connection.once('open', () => {
    console.log(`MongoDB connection established [${dbName}].`);
  });

  connection.on('disconnected', () => {
    console.log(`MongoDB connection disconnected [${dbName}].`);
  });

  return connection;
};

export const connectionNotificationsDB = createMongoConnection(MONGO_CONNECTION_NOTIFICATION_URI, 'NotificationsDB');

export const connectionAccountsDB = createMongoConnection(MONGO_CONNECTION_ACCOUNT_URI, 'AccountsDB');