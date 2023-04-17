import type { Address } from '$lib/blockchain/address';
import type { Readable } from 'svelte/store';

export interface RoleViewRepository {
    queen(): Promise<Address>;
    isMod(address: Address): Promise<boolean>;
}

export interface RoleViewCachingRepository extends RoleViewRepository {
    currentQueen(): Readable<Address | undefined>;
    isUserQueen(user: Address): Readable<boolean>;
    isUserMod(user: Address): Readable<boolean>;
    isUserQueenOrMod(user: Address): Readable<boolean>;
    refreshCache(): void;
}

export interface RoleRepository {
    view: RoleViewRepository;
}
