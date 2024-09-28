import { NodemailerMailing } from './nodemailer';
import { QueueHandler } from './queue';

export const MailingQueueType = {
  NODEMAILER: 'nodemailer'
};

export class MailingQueueFactory {
  static createQueue(type: string) {
    switch (type) {
      case MailingQueueType.NODEMAILER: {
        const nodemailerProvider = new NodemailerMailing();

        return new QueueHandler(nodemailerProvider.sendMails.bind(nodemailerProvider));
      }

      default:
        throw new Error('Unknown mailing provider type');
    }
  }
}