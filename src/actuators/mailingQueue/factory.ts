import AbstractMailingQueueInstance from './asbtract';
import NodemailerMailingQueueInstance from './nodemailer';

export const MailingQueueType = {
  NODEMAILER: 'nodemailer',
};

export interface MailingQueueFactoryArgs {
  type?: string;
}

export class MailingQueueFactory {
  static getInstance({ type }: MailingQueueFactoryArgs) {
    switch (type) {
      case MailingQueueType.NODEMAILER:
        return NodemailerMailingQueueInstance();
      default:
        return AbstractMailingQueueInstance();
    }
  }
}

const MailingQueueInstance = MailingQueueFactory.getInstance({ type: MailingQueueType.NODEMAILER });

export default MailingQueueInstance;