import UserModel from '../../models/accounts/user';
import { groupBy, keyBy, onlyUnique } from '../../utils';

export interface IEmailTemplate {
  subject: string;
  senderEmail?: string;
  toAddresses?: string[];
  toEmail: string;
  ccAddresses?: string[];
  templateName: string;
}

export interface ICampaignMailing {
  templateData: {
    name?: string;
  };
  emailTemplate: IEmailTemplate;
  userId: string;
}

export type SendEmailArgs = IEmailTemplate & { htmlPart: string }

export interface SendMailResponse {
  success: boolean;
  serviceResponse: Record<string, unknown>;
}

export class AbstractMailing {
  getParsedOptions(_emailTemplate: IEmailTemplate & { htmlPart: string }): unknown {
    throw new Error('getParsedOptions method not implemented');
  }

  async getGroupDataByTemplate(batch: ICampaignMailing[]) {
    const userIds = batch.map(({ userId }) => userId).filter(onlyUnique);
    const users = await UserModel.find({ _id: { $in: userIds } }).lean();

    return {
      groupDataByTemplate: groupBy(batch, ({ emailTemplate }) => emailTemplate.templateName),
      userById           : keyBy(users, '_id'),
    };
  }

  async sendMail(_args: SendEmailArgs): Promise<SendMailResponse> {
    throw new Error('sendMail method not implement');
  }

  async sendMails(_batch: ICampaignMailing[], _cb: () => void) {
    throw new Error('sendMails method not implement');
  }
}