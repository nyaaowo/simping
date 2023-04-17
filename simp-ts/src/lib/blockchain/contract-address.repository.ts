import type { Address } from '$lib/blockchain/address';
import { CONFIG } from '$lib/config/config';
import { Key } from '$lib/database/local-storage';
import { writable } from 'svelte/store';

function createContractAddressRepository() {
    const storedString = localStorage.getItem(Key.SimpContract);
    const stored: Address =
        storedString != null ? JSON.parse(storedString) : CONFIG.contractAddress;
    const { subscribe, set } = writable<Address>(stored);

    return {
        subscribe,
        switchContract: (contract: Address) => {
            localStorage.setItem(Key.SimpContract, JSON.stringify(contract));
            set(contract);
        }
    };
}

export const contractAddressRepository = createContractAddressRepository();
