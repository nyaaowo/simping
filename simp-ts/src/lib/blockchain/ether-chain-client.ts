import type { ChainClient } from '$lib/blockchain/chain-client';
import type { Receipt } from '$lib/blockchain/transaction/transaction-result';
import { weiToEther } from '$lib/blockchain/utils';
import type Big from 'big.js';
import type { Provider, TransactionReceipt } from 'ethers';
import type { Address } from './address';

export class EtherChainClient implements ChainClient {
    private provider: Provider;
    constructor(provider: Provider) {
        this.provider = provider;
    }

    async getFeeData(): Promise<{
        maxFeePerGas?: Big;
        maxPriorityFeePerGas?: Big;
        gasPrice?: Big;
    }> {
        const feeData = await this.provider.getFeeData();
        return {
            maxFeePerGas:
                feeData.maxFeePerGas != undefined ? weiToEther(feeData.maxFeePerGas) : undefined,
            maxPriorityFeePerGas:
                feeData.maxPriorityFeePerGas != undefined
                    ? weiToEther(feeData.maxPriorityFeePerGas)
                    : undefined,
            gasPrice: feeData.gasPrice != undefined ? weiToEther(feeData.gasPrice) : undefined
        };
    }

    async waitForTransaction(
        hash: string,
        confirm?: number,
        timeout?: number
    ): Promise<Receipt | undefined> {
        const receipt = await this.provider.waitForTransaction(hash, confirm, timeout);
        if (receipt == null) {
            return undefined;
        } else {
            return etherReceiptToReceipt(receipt);
        }
    }

    async balance(address: Address): Promise<Big> {
        const result = await this.provider.getBalance(address);
        return weiToEther(result);
    }
}

export function etherReceiptToReceipt(receipt: TransactionReceipt): Receipt {
    return {
        to: receipt.to ?? undefined,
        from: receipt.from,
        contractAddress: receipt.contractAddress ?? undefined,
        index: receipt.index,
        gasUsed: receipt.gasUsed,
        effectiveGasPrice: weiToEther(receipt.fee),
        hash: receipt.hash,
        blockHash: receipt.blockHash,
        blockNumber: receipt.blockNumber,
        logsBloom: receipt.logsBloom,
        status: receipt.status ?? undefined
    };
}
