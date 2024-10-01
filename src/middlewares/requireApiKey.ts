import { Request, Response, NextFunction } from 'express';
import { errorResponse } from '../utils';
import { API_KEYS } from '../configs';

export const requireApiKey = (keys: string[] = Object.keys(API_KEYS)) => (req: Request, res: Response, next: NextFunction) => {
  try {
    const apiKeys = Object.keys(API_KEYS)
      .filter((key) => keys.includes(key))
      .map((key) => API_KEYS[key]);

    const { apikey } = req.headers;

    if(!apiKeys.includes(apikey as string)) throw new Error('api key forbidden');

    return next();
  } catch (error) {
    return errorResponse({
      error,
      res
    });
  }
};