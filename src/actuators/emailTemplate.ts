import EmailTemplateModel from '../models/emailTemplate';

interface GetEmailTemplateArgs {
  templateNames: string[];
}

interface UpsertTemplateArgs {
  templateName: string;
  htmlPart: string;
}

class EmailTemplate {
  async getEmailTemplates({ templateNames }: GetEmailTemplateArgs) {
    return await EmailTemplateModel
      .find({ templateName: { $in: templateNames } })
      .lean();
  }

  async upsertTemplate({ templateName, htmlPart }: UpsertTemplateArgs) {
    return await EmailTemplateModel.findOneAndUpdate(
      { templateName },
      {
        $set: { htmlPart }
      },
      { 
        'new' : true,
        upsert: true
      }
    ).lean();
  }
}

const EmailTemplateActuator = new EmailTemplate();

export default EmailTemplateActuator;