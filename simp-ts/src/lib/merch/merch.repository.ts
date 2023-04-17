import type { Address } from '$lib/blockchain/address';
import type { TransactionResult } from '$lib/blockchain/transaction/transaction-result';
import { merchStatus, type Merch, type MerchStatus } from '$lib/merch/merch';
import type Big from 'big.js';
import type { Readable } from 'svelte/store';

export interface MerchViewRepository {
    allMerchs(filter?: MerchFilterOption, sort?: MerchSortOption): Promise<Merch[]>;
    merch(id: number): Promise<Merch>;
    donatedAmount(id: number, donor: Address): Promise<Big>;
}

export interface MerchViewCachingRepository extends MerchViewRepository {
    currentMerch(id: number): Readable<Merch | undefined>;
    allCurrentMerchs(filter?: MerchFilterOption, sort?: MerchSortOption): Readable<Merch[]>;
    currentDonatedAmount(id: number, donor: Address): Readable<Big>;
    refreshCache(): void;
}

export interface MerchRepository extends MerchViewRepository {
    createMerch(
        name: string,
        imageUrl: string,
        target: Big,
        expiry: Date
    ): Promise<TransactionResult>;
    updateMerch(
        id: number,
        name: string,
        imageUrl: string,
        target: Big,
        expiry: Date
    ): Promise<TransactionResult>;
}

export type MerchSortOption = 'Default' | 'Amount';
export type MerchFilterOption = Record<MerchStatus, boolean>;
export const merchSortRecord: Record<MerchSortOption, (merchs: Merch[]) => void> = {
    Default: sortMerchDefault,
    Amount: sortMerchAmountFromHighest
};

// mapping merch status to their order
export const merchStatusOrder: Record<MerchStatus, number> = {
    Active: 0,
    Refundable: 1,
    Completed: 2
};

export function sortMerchDefault(merchs: Merch[]) {
    merchs.sort((a, b) => {
        const aStatus = merchStatus(a);
        const bStatus = merchStatus(b);
        if (aStatus === bStatus) {
            return a.id - b.id;
        }
        return merchStatusOrder[aStatus] - merchStatusOrder[bStatus];
    });
}

function sortMerchAmountFromHighest(merchs: Merch[]) {
    merchs.sort((a, b) => {
        return b.currentAmount.minus(a.currentAmount).toNumber();
    });
}
