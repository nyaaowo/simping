import { browser } from '$app/environment';
import type { TransactionHistory } from '$lib/blockchain/transaction/transaction-history';
import { etherToWei, weiToEther } from '$lib/blockchain/utils';
import { dexieDb, type TransactionHistoryDto } from '$lib/database/dexie';
import { dexieObservableToReadable } from '$lib/database/utils';
import { liveQuery, type IndexableType, type PromiseExtended } from 'dexie';
import type { Readable } from 'svelte/store';

export type TransactionHistoryFilter = 'Pending' | 'Success' | 'Failure';

export class DexieTransactionHistoryRepository {
    deleteAll(): PromiseExtended<void> {
        return dexieDb.transactionHistories.clear();
    }

    delete(hash: string): PromiseExtended<void> {
        return dexieDb.transactionHistories.delete(hash);
    }

    updateByHash(transactionHistory: TransactionHistory): PromiseExtended<number> {
        return dexieDb.transactionHistories.update(
            transactionHistory.hash,
            toDto(transactionHistory)
        );
    }

    create(transactionHistory: TransactionHistory): PromiseExtended<IndexableType> {
        return dexieDb.transactionHistories.add(toDto(transactionHistory));
    }

    get(hash: string): PromiseExtended<TransactionHistory | undefined> {
        return dexieDb.transactionHistories.get(hash).then((history) => {
            if (history != undefined) {
                return toTransactionHistory(history);
            } else {
                return undefined;
            }
        });
    }

    allTransactions(filter?: TransactionHistoryFilter): PromiseExtended<TransactionHistory[]> {
        if (filter === 'Pending') {
            return this.pendingTransactions();
        } else {
            return dexieDb.transactionHistories
                .toCollection()
                .reverse()
                .sortBy('timestamp')
                .then((histories) => {
                    return toTransactionHistories(histories);
                });
        }
    }

    allCurrentTransactions(filter?: TransactionHistoryFilter): Readable<TransactionHistory[]> {
        return dexieObservableToReadable(
            liveQuery(() => (browser ? this.allTransactions(filter) : []))
        );
    }

    private pendingTransactions(): PromiseExtended<TransactionHistory[]> {
        return dexieDb.transactionHistories
            .where('status')
            .equals('Pending')
            .reverse()
            .sortBy('timestamp')
            .then((histories) => {
                return toTransactionHistories(histories);
            });
    }
}

function toDto(transactionHistory: TransactionHistory): TransactionHistoryDto {
    return {
        name: transactionHistory.name,
        status: transactionHistory.status,
        amount: etherToWei(transactionHistory.amount).toString(),
        gasFee: etherToWei(transactionHistory.gasFee).toString(),
        timestamp: transactionHistory.date.getTime(),
        hash: transactionHistory.hash
    };
}

function toTransactionHistory(history: TransactionHistoryDto): TransactionHistory {
    return {
        name: history.name,
        status: history.status,
        amount: weiToEther(history.amount),
        gasFee: weiToEther(history.gasFee),
        date: new Date(history.timestamp),
        hash: history.hash
    };
}

function toTransactionHistories(histories: TransactionHistoryDto[]): TransactionHistory[] {
    return histories.map((history) => {
        return toTransactionHistory(history);
    });
}
