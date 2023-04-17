import { ethers } from 'ethers';

export type Address = string;

export function compareAddress(a: Address, b: Address): boolean {
    return ethers.getAddress(a) === ethers.getAddress(b);
}
