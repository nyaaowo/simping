import type { Address } from '$lib/blockchain/address';
import type { SimpViewContract } from '$lib/blockchain/simp-contract';
import { merchStatus, type Merch } from '$lib/merch/merch';
import {
    merchSortRecord,
    type MerchFilterOption,
    type MerchSortOption,
    type MerchViewCachingRepository,
    type MerchViewRepository
} from '$lib/merch/merch.repository';
import Big from 'big.js';
import { derived, get, writable, type Readable, type Writable } from 'svelte/store';

function filterAndSortMerchs(
    merchs: Merch[],
    filter?: MerchFilterOption,
    sort?: MerchSortOption
): Merch[] {
    if (filter != null) {
        merchs.filter((merch) => {
            const status = merchStatus(merch);
            return status in filter;
        });
    }

    if (sort != null) {
        merchSortRecord[sort](merchs);
    }

    return merchs;
}

export class SimpMerchViewRepository implements MerchViewRepository {
    private contract: SimpViewContract;
    constructor(contract: SimpViewContract) {
        this.contract = contract;
    }

    async merch(id: number): Promise<Merch> {
        return await this.contract.merch(id);
    }

    async allMerchs(filter?: MerchFilterOption, sort?: MerchSortOption): Promise<Merch[]> {
        const merchs = await this.contract.allMerchs();
        return filterAndSortMerchs(merchs, filter, sort);
    }

    async donatedAmount(id: number, donor: Address): Promise<Big> {
        return await this.contract.donatedAmount(id, donor);
    }
}

export class SimpMerchViewCachingRepository implements MerchViewCachingRepository {
    private repo: SimpMerchViewRepository;
    private merchCache: Writable<Merch[] | undefined> = writable(undefined);
    private donatedAmountCache: Writable<Record<number, Record<Address, Big>> | undefined> =
        writable(undefined);
    constructor(contract: SimpViewContract) {
        this.repo = new SimpMerchViewRepository(contract);
    }

    currentDonatedAmount(id: number, donor: string): Readable<Big> {
        return derived(this.donatedAmountCache, (donatedAmount) => {
            if (
                donatedAmount == undefined ||
                donatedAmount[id] == undefined ||
                donatedAmount[id][donor] == undefined
            ) {
                setTimeout(() => {
                    this.donatedAmount(id, donor);
                }, 0);

                return Big(0);
            }
            return donatedAmount[id][donor];
        });
    }

    async donatedAmount(id: number, donor: Address): Promise<Big> {
        const cache = get(this.donatedAmountCache);
        if (cache == undefined || cache[id] == undefined || cache[id][donor] == undefined) {
            const amount = await this.repo.donatedAmount(id, donor);
            this.donatedAmountCache.update((value) => {
                if (value == undefined) {
                    value = {};
                }
                if (value[id] == undefined) {
                    value[id] = {};
                }
                value[id][donor] = amount;
                return value;
            });
            return amount;
        }
        return cache[id][donor];
    }

    async merch(id: number): Promise<Merch> {
        const allMerchs = await this.allMerchs();
        return allMerchs[id];
    }

    async allMerchs(filter?: MerchFilterOption, sort?: MerchSortOption): Promise<Merch[]> {
        const cache = get(this.merchCache);
        if (cache == undefined) {
            const allMerchs = await this.repo.allMerchs();
            this.merchCache.set(allMerchs);
            return filterAndSortMerchs(allMerchs, filter, sort);
        }
        return cache;
    }

    currentMerch(id: number): Readable<Merch | undefined> {
        return derived(this.allCurrentMerchs(), (merchs) => {
            return merchs.find((value) => {
                return value.id === id;
            });
        });
    }

    allCurrentMerchs(filter?: MerchFilterOption, sort?: MerchSortOption): Readable<Merch[]> {
        return derived(this.merchCache, (merchs) => {
            if (merchs == undefined) {
                setTimeout(() => {
                    this.allMerchs();
                }, 0);

                return [];
            }
            return filterAndSortMerchs(merchs, filter, sort);
        });
    }

    refreshCache() {
        this.merchCache.set(undefined);
        this.donatedAmountCache.set(undefined);
    }
}
