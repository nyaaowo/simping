import type { Address } from '$lib/blockchain/address';
import type Big from 'big.js';

export interface Receipt {
    to?: Address;
    from: Address;
    contractAddress?: Address;
    index: number;
    gasUsed: bigint;
    effectiveGasPrice: Big;
    hash: string;
    blockHash: string;
    blockNumber: number;
    logsBloom: string;
    status?: number;
}

export interface TransactionResult {
    hash: string;
    wait(): Promise<Receipt | undefined>;
}
