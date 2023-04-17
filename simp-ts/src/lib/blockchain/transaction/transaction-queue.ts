import type Big from 'big.js';
import { writable, type Readable } from 'svelte/store';
import type { Receipt } from './transaction-result';

export interface TransactionConfirmation {
    action: string;
    amount: Big;
    gasFee?: Big;
    completed?: boolean;
    onConfirm: () => Promise<Receipt>;
}

export interface TransactionQueue extends Readable<TransactionConfirmation | undefined> {
    send: (confirmation: TransactionConfirmation) => void;
    complete: () => void;
    clear: () => void;
}

function createTransactionQueue() {
    const { subscribe, set, update } = writable<TransactionConfirmation | undefined>(undefined);

    return {
        subscribe,
        send: (confirmation: TransactionConfirmation) => {
            set(confirmation);
        },
        complete: () => {
            update((value) => {
                if (value != undefined) {
                    value.completed = true;
                }
                return value;
            });
        },
        clear: () => {
            set(undefined);
        }
    };
}

export const transactionQueue = createTransactionQueue();
