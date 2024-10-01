import 'dotenv/config';

export const NODE_ENV = process.env.NODE_ENV as string ?? 'development';
export const SERVER_PORT = process.env.SERVER_PORT as string;
export const ALLOW_ORIGINS = process.env.ALLOW_ORIGINS as string;
export const MORGAN_FORMAT = NODE_ENV === 'production' ? 'common' : 'dev';

export const MONGO_CONNECTION_ACCOUNT_URI = process.env.MONGO_CONNECTION_ACCOUNT_URI as string;
export const MONGO_CONNECTION_NOTIFICATION_URI = process.env.MONGO_CONNECTION_NOTIFICATION_URI as string;

export const OAUTH_CLIENT_ID = process.env.OAUTH_CLIENT_ID as string;
export const OAUTH_CLIENT_SECRET = process.env.OAUTH_CLIENT_SECRET as string;
export const OAUTH_REFRESH_TOKEN = process.env.OAUTH_REFRESH_TOKEN as string;
export const EMAIL_NOTIFICATION = process.env.EMAIL_NOTIFICATION as string;
export const TEST_EMAIL = process.env.TEST_EMAIL as string;

const getApiKeys = () => {
  const apiKeys = Object.keys(process.env)
    .filter(key => key.startsWith('API_KEY'))
    .reduce((result: Record<string, string>, key) => {
      result[key] = process.env[key]!;

      return result;
    }, {});
  
  return apiKeys;
};

export const API_KEYS = getApiKeys();
