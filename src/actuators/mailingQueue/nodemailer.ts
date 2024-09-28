import nodemailer, { Transporter } from 'nodemailer';
import SMTPTransport from 'nodemailer/lib/smtp-transport';

import { AbstractMailing, ICampaignMailing, IEmailTemplate, SendEmailArgs, SendMailResponse } from './abstract';
import EmailTemplateActuator from '../emailTemplate';

import {
  EMAIL_NOTIFICATION,
  OAUTH_CLIENT_ID,
  OAUTH_CLIENT_SECRET,
  OAUTH_REFRESH_TOKEN
} from '../../configs';
import { compileTemplate, keyBy } from '../../utils';

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

  getParsedOptions({ subject, senderEmail, ccAddresses, toAddresses, toEmail, htmlPart  }: IEmailTemplate & { htmlPart: string}) {
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

  async sendMail(args: SendEmailArgs): Promise<SendMailResponse> {
    try {
      const transport = this.getTransport();

      const options = this.getParsedOptions(args);

      const infoResponse = await transport.sendMail(options);

      if(!infoResponse) throw new Error('not found infoResponse to send Email');

      return {
        serviceResponse: infoResponse,
        success        : true
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

      const { groupDataByTemplate } = await this.getGroupDataByTemplate(batch);

      const templateNames = Object.keys(groupDataByTemplate);

      const templates = await EmailTemplateActuator.getEmailTemplates({ templateNames });

      const templateBy = keyBy(templates, 'templateName');

      for (const templateName in groupDataByTemplate) {
        const campaingGroup = groupDataByTemplate[templateName];

        if(!campaingGroup?.length) 
          continue;
        
        const storeResults = await Promise.allSettled(campaingGroup.map(async (batch) => {
          const { emailTemplate, templateData } = batch ?? {};

          const { htmlPart } = templateBy[templateName] ?? {};

          if(!htmlPart) return {
            batch,
            serviceResponse: null,
            success        : false
          };

          const htmlPartWithData = compileTemplate({ htmlPart, templateData });

          const responseMail = await this.sendMail({
            ...emailTemplate,
            htmlPart: htmlPartWithData
          });
  
          return {
            batch,
            ...responseMail
          };
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