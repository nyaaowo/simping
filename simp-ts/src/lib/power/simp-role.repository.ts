import type { Address } from '$lib/blockchain/address';
import type { SimpViewContract } from '$lib/blockchain/simp-contract';
import type { RoleViewCachingRepository, RoleViewRepository } from '$lib/power/role.repository';
import { derived, get, writable, type Readable, type Writable } from 'svelte/store';

export class SimpRoleViewRepository implements RoleViewRepository {
    contract: SimpViewContract;

    constructor(contract: SimpViewContract) {
        this.contract = contract;
    }

    queen(): Promise<string> {
        return this.contract.queen();
    }

    isMod(address: Address): Promise<boolean> {
        return this.contract.isMod(address);
    }
}

export class SimpRoleViewCachingRepository implements RoleViewCachingRepository {
    private repo: SimpRoleViewRepository;
    private queenCache: Writable<Address | undefined> = writable(undefined);
    private isModCache: Writable<Map<Address, boolean> | undefined> = writable(undefined);

    constructor(contract: SimpViewContract) {
        this.repo = new SimpRoleViewRepository(contract);
    }

    async queen(): Promise<Address> {
        const cache = get(this.queenCache);
        if (cache == undefined) {
            const queenAddress = await this.repo.queen();
            this.queenCache.set(queenAddress);
            return queenAddress;
        }
        return cache;
    }

    async isMod(address: Address): Promise<boolean> {
        const cache = get(this.isModCache);
        if (cache == undefined || !cache.has(address)) {
            const isAddressMod = await this.repo.isMod(address);
            this.isModCache.update((value) => {
                if (value == undefined) {
                    const m: Map<Address, boolean> = new Map();
                    m.set(address, isAddressMod);
                    return m;
                } else {
                    value.set(address, isAddressMod);
                    return value;
                }
            });
            return isAddressMod;
        }
        return cache.get(address) ?? false;
    }

    currentQueen(): Readable<Address | undefined> {
        return derived(this.queenCache, (queenAddress) => {
            if (queenAddress == undefined) {
                setTimeout(() => {
                    this.queen();
                }, 0);
            }
            return queenAddress;
        });
    }

    isUserQueen(user: Address): Readable<boolean> {
        return derived(this.queenCache, (queenAddress) => {
            if (queenAddress == undefined) {
                setTimeout(() => {
                    this.queen();
                }, 0);
            }

            return user === queenAddress;
        });
    }

    isUserMod(user: Address): Readable<boolean> {
        return derived(this.isModCache, (isMod) => {
            if (isMod == undefined || !isMod.has(user)) {
                setTimeout(() => {
                    this.isMod(user);
                }, 0);
            }

            return isMod?.get(user) ?? false;
        });
    }

    isUserQueenOrMod(user: Address): Readable<boolean> {
        return derived([this.isUserQueen(user), this.isUserMod(user)], ([isQueen, isMod]) => {
            return isQueen || isMod;
        });
    }

    refreshCache() {
        this.queenCache.set(undefined);
        this.isModCache.set(undefined);
    }
}
