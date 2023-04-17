import { chainRepository } from '$lib/blockchain/chain.repository';
import { contractAddressRepository } from '$lib/blockchain/contract-address.repository';
import { EtherChainClient } from '$lib/blockchain/ether-chain-client';
import { EtherSimpContract, EtherSimpViewContract } from '$lib/blockchain/ether-simp-contract';
import { signerRepository } from '$lib/blockchain/signer.repository';
import { randomEthersProvider } from '$lib/blockchain/utils';
import type Guest from '$lib/power/guest';
import SimpleGuest from '$lib/power/simple-guest';
import User from '$lib/power/user';
import { ethers } from 'ethers';
import { derived, get } from 'svelte/store';

export type Power = User | Guest;

export function createCurrentPower() {
    let previousProvider = randomEthersProvider(get(chainRepository));
    const previousChain = get(chainRepository);
    const role = derived<
        [typeof chainRepository, typeof contractAddressRepository, typeof signerRepository],
        Power
    >(
        [chainRepository, contractAddressRepository, signerRepository],
        ([chain, contractAddress, signer]) => {
            if (chain != previousChain) {
                previousProvider = randomEthersProvider(chain);
            }

            if (signer != undefined) {
                const wallet = new ethers.Wallet(signer, previousProvider);
                const client = new EtherChainClient(previousProvider);
                const contract = new EtherSimpContract(
                    { provider: previousProvider, signer: wallet },
                    wallet.address,
                    contractAddress
                );
                return new User(wallet.address, client, contract);
            } else {
                const contract = new EtherSimpViewContract(previousProvider, contractAddress);
                return new SimpleGuest(contract);
            }
        }
    );

    return {
        ...role,
        signIn: (privateKey: string) => {
            signerRepository.set(privateKey);
        },
        signOut: () => {
            signerRepository.delete();
        }
    };
}

export const currentPower = createCurrentPower();
