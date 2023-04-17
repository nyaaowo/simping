import type Big from 'big.js';

export interface TransactionHistory {
    hash: string;
    name: string;
    status: 'Success' | 'Pending' | 'Failure';
    amount: Big;
    gasFee: Big;
    date: Date;
}
