import type { SupportedChain } from '$lib/blockchain/chain';
import { PublicRpcUrls } from '$lib/blockchain/rpc-urls';
import type { Simp } from '$lib/types/ethers-contract';
import { randomElement } from '$lib/utils/random';
import Big from 'big.js';
import { ethers, type Provider } from 'ethers';

export const ETHER_DECIMAL = 18;

const BigEther = Big();
BigEther.DP = ETHER_DECIMAL;

export function randomEthersProvider(chain: SupportedChain): Provider {
    return new ethers.JsonRpcProvider(randomElement(PublicRpcUrls[chain.name]));
}

export function signaturesStringToSortedSignatures(
    digest: string,
    signatures: string[]
): Simp.SignatureStruct[] {
    const res = signatures.map((signature) => {
        const signer = ethers.recoverAddress(digest, signature);
        const sig = ethers.Signature.from(signature);

        return {
            signer: signer,
            v: sig.v,
            r: sig.r,
            s: sig.s
        } as Simp.SignatureStruct;
    });

    res.sort((a, b) => {
        return a.signer.toString().localeCompare(b.signer.toString());
    });

    return res;
}

export function etherToWei(value: Big): bigint {
    return BigInt(
        BigEther(value.toString())
            .mul(10 ** ETHER_DECIMAL)
            .toFixed()
    );
}

export function weiToEther(value: bigint | string): Big {
    return BigEther(value.toString()).div(10 ** ETHER_DECIMAL);
}

export function privateKeyToAddress(privateKey: string): string | undefined {
    try {
        const wallet = new ethers.Wallet(privateKey);
        return wallet.address;
    } catch (error) {
        return undefined;
    }
}

export function mnemonicToAddress(seedPhrase: string, path?: string): string | undefined {
    try {
        const wallet = ethers.Wallet.fromPhrase(seedPhrase);
        return path === undefined ? wallet.address : wallet.derivePath(path).address;
    } catch (error) {
        return undefined;
    }
}

export function mnemonicToPrivateKey(seedPhrase: string, path?: string): string | undefined {
    try {
        const wallet = ethers.Wallet.fromPhrase(seedPhrase);
        return path === undefined ? wallet.privateKey : wallet.derivePath(path).privateKey;
    } catch (error) {
        return undefined;
    }
}
