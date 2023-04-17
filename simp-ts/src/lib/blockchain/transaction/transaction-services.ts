import type { Address } from '$lib/blockchain/address';
import type { SimpContract } from '$lib/blockchain/simp-contract';
import type { DexieTransactionHistoryRepository } from '$lib/blockchain/transaction/dexie-transaction-history.repository';
import type { Fee, TransactionOptions } from '$lib/blockchain/transaction/transaction-options';
import type { TransactionQueue } from '$lib/blockchain/transaction/transaction-queue';
import type { TransactionWaiter } from '$lib/blockchain/transaction/transaction-waiter';
import type { Timestamp } from '$lib/utils/timestamp';
import Big from 'big.js';
import type { PromiseExtended } from 'dexie';
import type { Readable } from 'svelte/store';
import type { TransactionHistory } from './transaction-history';
import type { Receipt } from './transaction-result';

export class TransactionServices {
    private contract: SimpContract;
    private transactionHistoryRepository: DexieTransactionHistoryRepository;
    queue: TransactionQueue;
    waiter: TransactionWaiter;
    constructor(
        contract: SimpContract,
        queue: TransactionQueue,
        transactionHistoryRepository: DexieTransactionHistoryRepository,
        waiter: TransactionWaiter
    ) {
        this.contract = contract;
        this.queue = queue;
        this.transactionHistoryRepository = transactionHistoryRepository;
        this.waiter = waiter;
    }

    private createAndWait(
        action: string,
        amount: Big,
        gasFee: Big,
        date: Date,
        hash: string
    ): PromiseExtended<Receipt> {
        return this.transactionHistoryRepository
            .create({
                name: action,
                status: 'Pending',
                amount: amount,
                gasFee: gasFee,
                date: date,
                hash: hash
            })
            .then(() => {
                return this.waiter.wait(hash);
            });
    }

    transactionHistory(): Readable<TransactionHistory[]> {
        return this.transactionHistoryRepository.allCurrentTransactions();
    }

    async donate(id: number, amount: Big, callback?: () => void, override?: TransactionOptions) {
        const fee = await this.contract.estimateGas.donate(id, amount);
        const action = 'Donate for Target';
        this.queue.send({
            action: action,
            amount: amount,
            gasFee: toGasFee(fee),
            onConfirm: async () => {
                const result = await this.contract.donate(id, amount, {
                    ...fee,
                    ...(override ?? {})
                });
                const receipt = await this.createAndWait(
                    action,
                    amount,
                    toGasFee(fee) ?? Big(0),
                    new Date(),
                    result.hash
                );
                callback?.();
                return receipt;
            }
        });
    }

    async donateTts(
        message: string,
        amount: Big,
        callback?: () => void,
        override?: TransactionOptions
    ) {
        const fee = await this.contract.estimateGas.donateTts(message, amount);
        const action = 'Donate with message';
        this.queue.send({
            action: action,
            amount: amount,
            gasFee: toGasFee(fee),
            onConfirm: async () => {
                const result = await this.contract.donateTts(message, amount, {
                    ...fee,
                    ...(override ?? {})
                });
                const receipt = await this.createAndWait(
                    action,
                    amount,
                    toGasFee(fee) ?? Big(0),
                    new Date(),
                    result.hash
                );
                callback?.();
                return receipt;
            }
        });
    }

    async releaseFund(id: number, callback?: () => void, override?: TransactionOptions) {
        const fee = await this.contract.estimateGas.releaseFund(id);
        const action = 'Release fund for recipient';
        this.queue.send({
            action: action,
            amount: Big(0),
            gasFee: toGasFee(fee),
            onConfirm: async () => {
                const result = await this.contract.releaseFund(id, { ...fee, ...(override ?? {}) });
                const receipt = await this.createAndWait(
                    action,
                    Big(0),
                    toGasFee(fee) ?? Big(0),
                    new Date(),
                    result.hash
                );
                callback?.();
                return receipt;
            }
        });
    }

    async approveRefund(id: number, callback?: () => void, override?: TransactionOptions) {
        const fee = await this.contract.estimateGas.approveRefund(id);
        const action = 'Approve refund for donor';
        this.queue.send({
            action: action,
            amount: Big(0),
            gasFee: toGasFee(fee),
            onConfirm: async () => {
                const result = await this.contract.approveRefund(id, {
                    ...fee,
                    ...(override ?? {})
                });
                const receipt = await this.createAndWait(
                    action,
                    Big(0),
                    toGasFee(fee) ?? Big(0),
                    new Date(),
                    result.hash
                );
                callback?.();
                return receipt;
            }
        });
    }

    async refund(id: number, simp: Address, callback?: () => void, override?: TransactionOptions) {
        const fee = await this.contract.estimateGas.refund(id, simp);
        const action = 'Refund';
        this.queue.send({
            action: action,
            amount: Big(0),
            gasFee: toGasFee(fee),
            onConfirm: async () => {
                const result = await this.contract.refund(id, simp, {
                    ...fee,
                    ...(override ?? {})
                });
                const receipt = await this.createAndWait(
                    action,
                    Big(0),
                    toGasFee(fee) ?? Big(0),
                    new Date(),
                    result.hash
                );
                callback?.();
                return receipt;
            }
        });
    }

    async createMerch(
        name: string,
        imageUrl: string,
        target: Big,
        expiry: Date,
        callback?: () => void,
        override?: TransactionOptions
    ) {
        const fee = await this.contract.estimateGas.createMerch(name, imageUrl, target, expiry);
        const action = 'Create new donation goal';
        this.queue.send({
            action: action,
            amount: Big(0),
            gasFee: toGasFee(fee),
            onConfirm: async () => {
                const result = await this.contract.createMerch(name, imageUrl, target, expiry, {
                    ...fee,
                    ...(override ?? {})
                });
                const receipt = await this.createAndWait(
                    action,
                    Big(0),
                    toGasFee(fee) ?? Big(0),
                    new Date(),
                    result.hash
                );
                callback?.();
                return receipt;
            }
        });
    }

    async updateMerch(
        id: number,
        name: string,
        imageUrl: string,
        target: Big,
        expiry: Date,
        callback?: () => void,
        override?: TransactionOptions
    ) {
        const fee = await this.contract.estimateGas.updateMerch(id, name, imageUrl, target, expiry);
        const action = 'Update donation goal';
        this.queue.send({
            action: action,
            amount: Big(0),
            gasFee: toGasFee(fee),
            onConfirm: async () => {
                const result = await this.contract.updateMerch(id, name, imageUrl, target, expiry, {
                    ...fee,
                    ...(override ?? {})
                });
                const receipt = await this.createAndWait(
                    action,
                    Big(0),
                    toGasFee(fee) ?? Big(0),
                    new Date(),
                    result.hash
                );
                callback?.();
                return receipt;
            }
        });
    }

    async abdicate(newQueen: Address, callback?: () => void, override?: TransactionOptions) {
        const fee = await this.contract.estimateGas.abdicate(newQueen);
        const action = 'Queen abdicate';
        this.queue.send({
            action: action,
            amount: Big(0),
            gasFee: toGasFee(fee),
            onConfirm: async () => {
                const result = await this.contract.abdicate(newQueen, {
                    ...fee,
                    ...(override ?? {})
                });
                const receipt = await this.createAndWait(
                    action,
                    Big(0),
                    toGasFee(fee) ?? Big(0),
                    new Date(),
                    result.hash
                );
                callback?.();
                return receipt;
            }
        });
    }

    async promoteMod(
        mod: Address,
        deadline: Timestamp,
        signatures: string[],
        callback?: () => void,
        override?: TransactionOptions
    ) {
        const fee = await this.contract.estimateGas.promoteMod(mod, deadline, signatures);
        const action = `Promote mod ${String(mod)}`;
        this.queue.send({
            action: action,
            amount: Big(0),
            gasFee: toGasFee(fee),
            onConfirm: async () => {
                const result = await this.contract.promoteMod(mod, deadline, signatures, {
                    ...fee,
                    ...(override ?? {})
                });
                const receipt = await this.createAndWait(
                    action,
                    Big(0),
                    toGasFee(fee) ?? Big(0),
                    new Date(),
                    result.hash
                );
                callback?.();
                return receipt;
            }
        });
    }

    async demoteMod(
        mod: Address,
        deadline: Timestamp,
        signatures: string[],
        callback?: () => void,
        override?: TransactionOptions
    ) {
        const fee = await this.contract.estimateGas.demoteMod(mod, deadline, signatures);
        const action = `Demote mod ${String(mod)}`;
        this.queue.send({
            action: action,
            amount: Big(0),
            gasFee: toGasFee(fee),
            onConfirm: async () => {
                const result = await this.contract.demoteMod(mod, deadline, signatures, {
                    ...fee,
                    ...(override ?? {})
                });
                const receipt = await this.createAndWait(
                    action,
                    Big(0),
                    toGasFee(fee) ?? Big(0),
                    new Date(),
                    result.hash
                );
                callback?.();
                return receipt;
            }
        });
    }

    async updateModThreshold(
        threshold: number,
        deadline: Timestamp,
        signatures: string[],
        callback?: () => void,
        override?: TransactionOptions
    ) {
        const fee = await this.contract.estimateGas.updateModThreshold(
            threshold,
            deadline,
            signatures
        );
        const action = 'Update multisig threshold';
        this.queue.send({
            action: action,
            amount: Big(0),
            gasFee: toGasFee(fee),
            onConfirm: async () => {
                const result = await this.contract.updateModThreshold(
                    threshold,
                    deadline,
                    signatures,
                    {
                        ...fee,
                        ...(override ?? {})
                    }
                );
                const receipt = await this.createAndWait(
                    action,
                    Big(0),
                    toGasFee(fee) ?? Big(0),
                    new Date(),
                    result.hash
                );
                callback?.();
                return receipt;
            }
        });
    }

    async signPromoteMod(mod: Address, deadline: Timestamp): Promise<string> {
        return await this.contract.signPromoteMod(mod, deadline);
    }

    async signDemoteMod(mod: Address, deadline: Timestamp): Promise<string> {
        return await this.contract.signDemoteMod(mod, deadline);
    }

    async signUpdateModeThreshold(threshold: number, deadline: Timestamp): Promise<string> {
        return await this.contract.signUpdateModThreshold(threshold, deadline);
    }
}

function toGasFee(fee: Fee): Big | undefined {
    return fee.gasLimit != undefined && fee.maxFeePerGas != undefined
        ? fee.maxFeePerGas.mul(fee.gasLimit.toString())
        : undefined;
}
