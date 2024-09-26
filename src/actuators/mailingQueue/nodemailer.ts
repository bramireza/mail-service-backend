import nodemailer, { Transporter } from 'nodemailer';
import SMTPTransport from 'nodemailer/lib/smtp-transport';
import BetterQueue from 'better-queue';

import UserModel from '../../models/accounts/user';
import { AbstractMailingQueue, defaultStorageOptions, ICampaignMailing, IEmailTemplate } from './asbtract';
import EmailTemplateActuator from '../emailTemplate';

import {
  EMAIL_NOTIFICATION,
  OAUTH_CLIENT_ID,
  OAUTH_CLIENT_SECRET,
  OAUTH_REFRESH_TOKEN
} from '../../configs';
import { groupBy, keyBy, onlyUnique } from '../../utils';

class NodemailerMailingQueue extends AbstractMailingQueue {
  protected queue: BetterQueue;
  protected static defaultInstance: NodemailerMailingQueue;
  private smtpTransport?: SMTPTransport;
  private transport?: Transporter;

  constructor() {
    super();

    this.queue = new BetterQueue(
      async (...args) => {
        await this.sendMails(...args);
      },
      { batchSize: 50, store: defaultStorageOptions },
    );
  }

  static getInstance() {
    if(!NodemailerMailingQueue.defaultInstance)
      NodemailerMailingQueue.defaultInstance = new this();

    return NodemailerMailingQueue.defaultInstance;
  }

  static queue() {
    return NodemailerMailingQueue.getInstance().queue;
  }
  
  private  getSMTPTransport() {
    if(!this.smtpTransport)
      this.smtpTransport = new SMTPTransport({
        auth: {
          clientId    : OAUTH_CLIENT_ID!,
          clientSecret: OAUTH_CLIENT_SECRET!,
          refreshToken: OAUTH_REFRESH_TOKEN!,
          type        : 'OAuth2',
          user        : EMAIL_NOTIFICATION!
        },
        host  : 'smtp.gmail.com',
        port  : 465,
        secure: true
      });
    
    return this.smtpTransport;
  }

  private getTransport() {
    if(!this.transport)
      this.transport = nodemailer.createTransport(this.getSMTPTransport());

    return this.transport;
  }

  private getParsedOptions({ subject, senderEmail, ccAddresses, toAddresses, toEmail, htmlPart  }: IEmailTemplate & { htmlPart: string}) {
    return {
      from   : `${senderEmail ?? 'Notificaciones'} <${EMAIL_NOTIFICATION}>`,
      html   : htmlPart,
      replyTo: ccAddresses,
      subject,
      to     : [
        toEmail,
        ...toAddresses?.length ? toAddresses : []
      ]
    };

  }

  async getGroupDataByTemplate(batch: ICampaignMailing[]) {
    const userIds = batch
      .map(({ userId }) => userId)
      .filter(onlyUnique);
    
    const users = await UserModel.find({ _id: { $in: userIds } }).lean();

    return {
      groupDataByTemplate: groupBy(batch, 'templateName'),
      userById           : keyBy(users, '_id')
    };
  }

  async sendMails(batch: ICampaignMailing[], cb: () => unknown) {
    try {
      const transport = this.getTransport();

      const { groupDataByTemplate } = await this.getGroupDataByTemplate(batch);

      const templateNames = Object.keys(groupDataByTemplate);

      const templates = await EmailTemplateActuator.getEmailTemplates({ templateNames });

      const templateBy = keyBy(templates, 'templateName');

      for (const templateName in groupDataByTemplate) {
        const campaingGroup = groupDataByTemplate[templateName];

        if(!campaingGroup?.length) 
          continue;
        
        const storeResults = await Promise.allSettled(campaingGroup.map(async (batch) => {
          const { emailTemplate } = batch ?? {};

          const template = templateBy[templateName];

          const result = {
            batch,
            serviceResponse: {},
            success        : true,
          };
  
          try {
            const options = this.getParsedOptions({
              ...emailTemplate,
              htmlPart: template.htmlPart
            });

            const infoResponse = await transport.sendMail(options);
  
            if(!infoResponse) {
              result.success = false;

              return result;
            }
  
            result.serviceResponse = infoResponse;
          } catch (error: unknown) {
            console.log('🚀 ~ NodemailerMailingQueue ~ storeResults ~ error:', error);

            result.success = false;
          }
  
          return result;
        }));        
        console.log('🚀 ~ NodemailerMailingQueue ~ storeResults ~ storeResults:', JSON.stringify(storeResults, null, 2));
      }
      
      setTimeout(() => {
        cb();
      }, 1000);
    }
    catch (error) {
      console.error(error);

      cb();
    }
  }
}

export default NodemailerMailingQueue.queue;