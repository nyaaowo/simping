import type { Receipt } from '$lib/blockchain/transaction/transaction-result';
import type Big from 'big.js';
import type { Address } from './address';
import type { Fee } from './transaction/transaction-options';

export interface ChainClient {
    waitForTransaction(
        hash: string,
        confirm?: number,
        timeout?: number
    ): Promise<Receipt | undefined>;
    balance(address: Address): Promise<Big>;
    getFeeData(): Promise<Fee>;
}
