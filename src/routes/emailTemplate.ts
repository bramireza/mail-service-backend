import { Router } from 'express';
import EmailTemplateController from '../controllers/emailTemplate';

const EmailTemplateRouter: Router = Router();

EmailTemplateRouter.post('/upsert', EmailTemplateController.upsert);

export default EmailTemplateRouter;