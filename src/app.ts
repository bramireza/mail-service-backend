import express, { Request, Response, Application } from 'express';
import logger from 'morgan';
import cors from 'cors';
import cookieParser from 'cookie-parser';
import { corsConfig, MORGAN_FORMAT } from './configs';
import { errorResponse, successResponse } from './utils';
import mainRouter from './routes';

const app: Application = express();

app.use(logger(MORGAN_FORMAT));
app.use(cors(corsConfig));
app.use(cookieParser());

app.use(express.json());

// apply main router
app.use('/api/v1', mainRouter);

app.get('/', (_: Request, res: Response) => successResponse({ data: { date: new Date(), version: 'v1' }, res }));

// Route 404 default
app.use((req: Request, res: Response) => errorResponse({
  message: `[${req.method}]: ${req.originalUrl} not found`,
  res,
  status: 404,
}));

export default app;