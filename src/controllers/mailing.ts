import { Request, Response } from 'express';
import { errorResponse, successResponse } from '../utils';
import MailingQueueInstance from '../actuators/mailingQueue';

class Mailing {
  async sendMails(req: Request, res: Response) {
    try {
      const { data } = req.body;

      data?.forEach((emailData: unknown) => {
        MailingQueueInstance.push(emailData);
      });

      return successResponse({ res });
    } catch (error) {
      return errorResponse({ error, res });
    }
  }
}

const MailingController = new Mailing();

export default MailingController;