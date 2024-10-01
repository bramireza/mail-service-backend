import { MailingQueueFactory, MailingQueueType } from './factory';

const MailingQueueInstance = MailingQueueFactory.createQueue(MailingQueueType.NODEMAILER);

export default MailingQueueInstance;