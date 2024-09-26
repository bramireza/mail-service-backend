import BetterQueue from 'better-queue';
import { DataBaseDialects } from '../../interfaces';

export const defaultStorageOptions = {    
  dialect: DataBaseDialects.SQLITE3,
  path   : './temp_queue_data.sqlite',
  type   : DataBaseDialects.SQLITE3,
};

export interface IEmailTemplate {
  subject: string;
  senderEmail?: string;
  toAddresses?: string[];
  toEmail: string;
  ccAddresses?: string[];
}

export interface ICampaignMailing {
  // templateData: {
  //   // args dinamicos
  // };
  emailTemplate: IEmailTemplate;
  templateName: string;
  userId: string;
}

export class AbstractMailingQueue {
  protected queue: BetterQueue;
  protected static defaultInstance: AbstractMailingQueue;

  constructor()  {
    this.queue = new BetterQueue(
      async (...args) => {
        await this.sendMails(...args);
      },
      { batchSize: 50, store: defaultStorageOptions },
    );
  }

  static getInstance() {
    if(!AbstractMailingQueue.defaultInstance) 
      AbstractMailingQueue.defaultInstance = new this();

    return AbstractMailingQueue.defaultInstance;
  }

  static queue() {
    return AbstractMailingQueue.getInstance().queue;
  }

  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  async sendMails(batch: ICampaignMailing[], cb: () => unknown) {
    throw new Error('function not implement');
  }
}

export default AbstractMailingQueue.queue;