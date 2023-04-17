import { AllSupportedChains, type ChainNetwork, type SupportedChain } from '$lib/blockchain/chain';
import { CONFIG } from '$lib/config/config';
import { Key } from '$lib/database/local-storage';
import { writable } from 'svelte/store';

function createChainRepository() {
    const storedString = localStorage.getItem(Key.Chain);
    const stored: ChainNetwork = storedString != null ? JSON.parse(storedString) : CONFIG.chain;
    const { subscribe, set } = writable<SupportedChain>(
        AllSupportedChains.find((value) => {
            return value.name === stored.name && value.chainId === stored.chainId;
        })
    );

    return {
        subscribe,
        switchChain: (chain: SupportedChain) => {
            localStorage.setItem(Key.Chain, JSON.stringify(chain));
            set(chain);
        }
    };
}

export const chainRepository = createChainRepository();
