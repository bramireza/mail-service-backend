import nodemailer, { Transporter } from 'nodemailer';
import SMTPTransport from 'nodemailer/lib/smtp-transport';

import { AbstractMailing, ICampaignMailing, ICampaignMailingStore, IEmailTemplate, SendEmailArgs, SendMailResponse } from './abstract';
import EmailTemplateActuator from '../emailTemplate';

import {
  EMAIL_NOTIFICATION,
  OAUTH_CLIENT_ID,
  OAUTH_CLIENT_SECRET,
  OAUTH_REFRESH_TOKEN
} from '../../configs';
import { compileTemplate, keyBy, sleep } from '../../utils';

export class NodemailerMailing extends AbstractMailing {
  private smtpTransport?: SMTPTransport;
  private transport?: Transporter;

  private getSMTPTransport() {
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

  getParsedOptions({
    subject,
    senderEmail,
    senderName,
    ccAddresses,
    toAddresses,
    toEmail,
    htmlPart,
    sandbox
  }: IEmailTemplate & { htmlPart: string }) {
    const toEmails = this.getEmailRecipients({ sandbox, toAddresses, toEmail });
    
    const senderNotification = this.getSenderNotification({ senderEmail, senderName });

    return {
      from   : senderNotification,
      html   : htmlPart,
      replyTo: ccAddresses,
      subject,
      to     : toEmails
    };
  }

  async sendMail(args: SendEmailArgs): Promise<SendMailResponse> {
    try {
      const transport = this.getTransport();

      const options = this.getParsedOptions(args);

      const infoResponse = await transport.sendMail(options);

      if(!infoResponse) throw new Error('not found infoResponse to send Email');

      const { response, messageId } = infoResponse;

      console.log('🚀 ~ NodemailerMailing ~ sendMail ~ messageId:', messageId);

      return {
        serviceResponse: {
          messageId,
          response
        },
        success: true
      };
    } catch (error: unknown) {
      console.log('🚀 ~ NodemailerMailing ~ sendMail ~ error:', error);

      return {
        serviceResponse: {
          errorMessage: (error instanceof Error) ? error.message : 'error to send mail',
        },
        success: false
      };
    }
  }

  async sendMails(batch: ICampaignMailing[], cb: () => void) {
    try {
      const { groupDataByTemplate, userById } = await this.getGroupDataByTemplate(batch);

      const templateNames = Object.keys(groupDataByTemplate);

      const templates = await EmailTemplateActuator.getEmailTemplates({ templateNames });

      const templateBy = keyBy(templates, 'templateName');

      for (const templateName in groupDataByTemplate) {
        const campaingGroup = groupDataByTemplate[templateName];

        if(!campaingGroup?.length) 
          continue;
        
        const storeResults = await Promise.all(campaingGroup.map(async (batch) => {
          const batchStore: ICampaignMailingStore = batch;
          const { emailTemplate, templateData, userId } = batchStore ;

          const { htmlPart } = templateBy[templateName] ?? {};

          if(userId)
            batchStore['userInfo'] = userById[userId];

          if(!htmlPart) return {
            batch          : batchStore,
            serviceResponse: {
              errorMessage: 'htmlPart not found in template',
            },
            success: false
          };

          const htmlPartWithData = compileTemplate({ htmlPart, templateData });

          batchStore.emailTemplate['body'] = htmlPartWithData;

          const responseMail = await this.sendMail({
            ...emailTemplate,
            htmlPart: htmlPartWithData
          });
  
          return {
            batch: batchStore,
            ...responseMail
          };
        }));

        await this.createCampaigns(storeResults);
      }
      
      await sleep(1_000);
      
      cb();
    }
    catch (error) {
      console.error(error);

      cb();
    }
  }
}