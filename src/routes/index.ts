import { Router } from 'express';
import EmailTemplateRouter from './emailTemplate';
import MailingRouter from './mailing';

const mainRouter = Router();

// add some routes
mainRouter.use('/emailTemplate', EmailTemplateRouter);
mainRouter.use('/mailing', MailingRouter);

export default mainRouter;