/* eslint-disable @typescript-eslint/no-explicit-any */
import BetterQueue from 'better-queue';
import { DataBaseDialects } from '../../interfaces';

export const DEFAULT_STORE_OPTIONS = {    
  dialect: DataBaseDialects.SQLITE3,
  path   : './temp_queue_data.sqlite',
  type   : DataBaseDialects.SQLITE3,
};

export interface QueueHandlerOptions {
  batchSize?: number;
  store?: BetterQueue.StoreOptions;
}

export class QueueHandler {
  private queue!: BetterQueue;

  constructor(
    private sendMail: (batch: any[], cb: () => void) => Promise<void>, 
    options?: QueueHandlerOptions
  ) {
    this.queue = new BetterQueue(
      async (...args) => {
        await this.sendMail(...args);
      },
      {
        batchSize: 50,
        ...options,
        store    : {
          ...DEFAULT_STORE_OPTIONS,
          ...options?.store
        }
      }
    );
  }

  public push(task: any) {
    this.queue.push(task);
  }
}
