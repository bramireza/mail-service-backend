import 'dotenv/config';

export const NODE_ENV = process.env.NODE_ENV as string ?? 'development';
export const SERVER_PORT = process.env.SERVER_PORT as string;
export const MONGO_CONNECTION_URI = process.env.MONGO_CONNECTION_URI as string;
export const ALLOW_ORIGINS = process.env.ALLOW_ORIGINS as string;
export const MORGAN_FORMAT = NODE_ENV === 'production' ? 'common' : 'dev';