import type { ChainClient } from '$lib/blockchain/chain-client';
import type { DexieTransactionHistoryRepository } from '$lib/blockchain/transaction/dexie-transaction-history.repository';
import type { Receipt } from './transaction-result';

export class TransactionWaiter {
    private transactionHistoryRepository: DexieTransactionHistoryRepository;
    private chainClient: ChainClient;
    constructor(
        transactionHistoryRepository: DexieTransactionHistoryRepository,
        chainClient: ChainClient
    ) {
        this.transactionHistoryRepository = transactionHistoryRepository;
        this.chainClient = chainClient;
    }

    async wait(hash: string): Promise<Receipt> {
        const receipt = await this.chainClient.waitForTransaction(hash);
        if (receipt != undefined) {
            if (receipt.status === 1 || receipt.status === 0) {
                return this.transactionHistoryRepository
                    .get(hash)
                    .then((history) => {
                        if (history != undefined) {
                            return this.transactionHistoryRepository.updateByHash({
                                hash: hash,
                                name: history?.name,
                                status: receipt.status === 1 ? 'Success' : 'Failure',
                                amount: history.amount,
                                gasFee: history.gasFee,
                                date: history.date
                            });
                        } else {
                            throw new Error('Pending transaction not added to database');
                        }
                    })
                    .then((result) => {
                        if (result === 1) {
                            return receipt;
                        }
                        throw new Error('Failed to update transaction history');
                    });
            } else {
                throw new Error('Unknown receipt status');
            }
        } else {
            throw new Error('Receipt not found');
        }
    }

    async waitForAllPending(): Promise<Receipt[]> {
        const pending = await this.transactionHistoryRepository.allTransactions('Pending');
        return Promise.all(
            pending.map((history) => {
                return this.wait(history.hash);
            })
        );
    }
}
