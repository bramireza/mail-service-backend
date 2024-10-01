import { Router } from 'express';
import EmailTemplateRouter from './emailTemplate';
import MailingRouter from './mailing';
import { requireApiKey } from '../middlewares';

const mainRouter = Router();

// add some routes
mainRouter.use('/emailTemplate', requireApiKey(), EmailTemplateRouter);
mainRouter.use('/mailing', requireApiKey(), MailingRouter);

export default mainRouter;