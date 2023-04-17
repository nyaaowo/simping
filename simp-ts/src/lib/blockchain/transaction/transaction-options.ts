import { etherToWei } from '$lib/blockchain/utils';
import type Big from 'big.js';

export interface Fee {
    maxFeePerGas?: Big;
    maxPriorityFeePerGas?: Big;
    gasLimit?: bigint;
}

export type TransactionOptions = Fee;

export function populateTransaction(options?: TransactionOptions): {
    gasLimit?: bigint;
    maxFeePerGas?: bigint;
    maxPriorityFeePerGas?: bigint;
} {
    if (options == undefined) {
        return {};
    }

    return {
        gasLimit: options.gasLimit,
        maxFeePerGas:
            options.maxFeePerGas != undefined ? etherToWei(options.maxFeePerGas) : undefined,
        maxPriorityFeePerGas:
            options.maxPriorityFeePerGas != undefined
                ? etherToWei(options.maxPriorityFeePerGas)
                : undefined
    };
}
