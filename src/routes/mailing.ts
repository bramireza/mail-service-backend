import { Router } from 'express';
import MailingController from '../controllers/mailing';

const MailingRouter: Router = Router();

MailingRouter.post('/sendMails', MailingController.sendMails);

export default MailingRouter;