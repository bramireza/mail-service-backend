import UserModel, { User } from '../../models/accounts/user';
import CampaignModel, { CampaignStatus } from '../../models/campaign';
import { groupBy, keyBy, onlyUnique } from '../../utils';
import { EMAIL_NOTIFICATION, TEST_EMAIL } from '../../configs';

export interface IEmailTemplate {
  subject: string;
  senderEmail?: string;
  senderName?: string;
  toAddresses?: string[];
  toEmail: string;
  ccAddresses?: string[];
  templateName: string;
  sandbox: boolean;
}

export interface ICampaignMailing {
  templateData: {
    firtName?: string;
    lastName?: string;
  };
  emailTemplate: IEmailTemplate;
  userId: string;
}

export interface ICampaignMailingStore {
  templateData: {
    firtName?: string;
    lastName?: string;
  };
  emailTemplate: IEmailTemplate & { body?: string; };
  userId: string;
  userInfo?: Pick<User, '_id' | 'email' | 'firstName' | 'lastName'>
}

export type SendEmailArgs = IEmailTemplate & { htmlPart: string }

export interface SendMailResponse {
  success: boolean;
  serviceResponse: {
    messageId?: string;
    response?: string;
    errorMessage?: string;
  };
}

export type CreateCampaignsArgs = {
  batch: ICampaignMailingStore;
} & SendMailResponse

export class AbstractMailing {
  getParsedOptions(_emailTemplate: IEmailTemplate & { htmlPart: string }): unknown {
    throw new Error('getParsedOptions method not implemented');
  }

  async getGroupDataByTemplate(batch: ICampaignMailing[]) {
    const userIds = batch.map(({ userId }) => userId).filter(onlyUnique);
    const users = await UserModel
      .find({ _id: { $in: userIds } })
      .select({ email: 1, firstName: 1, lastName: 1 })
      .lean();

    return {
      groupDataByTemplate: groupBy(batch, ({ emailTemplate }) => emailTemplate.templateName),
      userById           : keyBy(users, '_id'),
    };
  }

  protected getSenderNotification({ senderName, senderEmail }: Pick<IEmailTemplate, 'senderName' | 'senderEmail'>) {
    return `${senderName ?? 'Notificaciones'} <${senderEmail ?? EMAIL_NOTIFICATION}>`;
  }

  protected getEmailRecipients({ toEmail, toAddresses, sandbox }: Pick<IEmailTemplate, 'toEmail' | 'toAddresses' | 'sandbox'>) {
    if(sandbox) return [ TEST_EMAIL ];

    const emailRecipients =  [
      toEmail,
      ...toAddresses?.length ? toAddresses : []
    ].filter(onlyUnique);

    return emailRecipients;
  }

  async sendMail(_args: SendEmailArgs): Promise<SendMailResponse> {
    throw new Error('sendMail method not implement');
  }

  async sendMails(_batch: ICampaignMailing[], _cb: () => void) {
    throw new Error('sendMails method not implement');
  }

  async createCampaigns(campaigns: CreateCampaignsArgs[]) {
    const parsedCampaigns = campaigns.map(({ batch, serviceResponse, success }) => {
      const { emailTemplate, userId, userInfo } = batch;
      const { senderEmail, senderName } = emailTemplate;
      const senderNotification = this.getSenderNotification({ senderEmail, senderName });

      return {
        emailBody     : emailTemplate.body,
        emailRecipient: emailTemplate.toEmail,
        emailSender   : senderNotification,
        emailSubject  : emailTemplate.subject,
        sandbox       : emailTemplate.sandbox,
        serviceResponse,
        status        : success ? CampaignStatus.Send : CampaignStatus.Failed,
        templateName  : emailTemplate.templateName,
        userId,
        userInfo
      };
    });

    await CampaignModel.insertMany(parsedCampaigns);
  }
}