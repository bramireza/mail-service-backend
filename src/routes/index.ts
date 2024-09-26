import { Router } from 'express';
import testRouter from './test.routes';

const mainRouter = Router();

// add some routes
mainRouter.use('/test', testRouter);

export default mainRouter;