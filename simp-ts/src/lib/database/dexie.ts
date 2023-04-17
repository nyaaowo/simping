import Dexie, { type Table } from 'dexie';

export interface TransactionHistoryDto {
    hash: string;
    name: string;
    status: 'Success' | 'Pending' | 'Failure';
    amount: string;
    gasFee: string;
    timestamp: number;
}

export class DexieDb extends Dexie {
    transactionHistories!: Table<TransactionHistoryDto, string>;

    constructor() {
        super('Default');
        this.version(2).stores({
            transactionHistories: '&hash, timestamp, status' // Primary key and indexed props
        });
    }
}

export const dexieDb = new DexieDb();
