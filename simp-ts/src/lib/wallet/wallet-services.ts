import type { Address } from '$lib/blockchain/address';
import type { ChainClient } from '$lib/blockchain/chain-client';
import type Big from 'big.js';

export class WalletServices {
    private client: ChainClient;
    constructor(client: ChainClient, address: Address) {
        this.address = address;
        this.client = client;
    }

    address: Address;
    balance(): Promise<Big> {
        return this.client.balance(this.address);
    }
}
