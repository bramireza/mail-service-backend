import { Request, Response } from 'express';
import { errorResponse, successResponse } from '../utils';
import EmailTemplateActuator from '../actuators/emailTemplate';

class EmailTemplate {
  async upsert(req: Request, res: Response) {
    try {
      const { templateName, htmlPart } = req.body;

      if(!templateName) throw new Error('templateName is required');
      if(!htmlPart) throw new Error('htmlPart is required');

      const template = await EmailTemplateActuator.upsertTemplate({ htmlPart, templateName });

      return successResponse({ data: template, res });
    } catch (error) {
      return errorResponse({ error, res });
    }
  }
}

const EmailTemplateController = new EmailTemplate();

export default EmailTemplateController;