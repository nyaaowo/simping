import type { SimpViewContract } from '$lib/blockchain/simp-contract';
import { derived, get, writable, type Readable, type Writable } from 'svelte/store';
import type {
    GovernanceViewCachingRepository,
    GovernanceViewRepository
} from './governance.repository';

export class SimpGovernanceViewRepository implements GovernanceViewRepository {
    private contract: SimpViewContract;
    constructor(contract: SimpViewContract) {
        this.contract = contract;
    }

    modThreshold(): Promise<number> {
        return this.contract.modThreshold();
    }
}

export class SimpGovernanceViewCachingRepository implements GovernanceViewCachingRepository {
    private repo: SimpGovernanceViewRepository;
    private thresholdCache: Writable<number | undefined> = writable(undefined);
    constructor(contract: SimpViewContract) {
        this.repo = new SimpGovernanceViewRepository(contract);
    }

    currentModThreshold(): Readable<number> {
        return derived(this.thresholdCache, (threshold) => {
            if (threshold == undefined) {
                setTimeout(() => {
                    this.modThreshold();
                }, 0);
                return -1;
            }
            return threshold;
        });
    }

    async modThreshold(): Promise<number> {
        const cache = get(this.thresholdCache);
        if (cache == undefined) {
            const threshold = await this.repo.modThreshold();
            this.thresholdCache.set(threshold);
            return threshold;
        }
        return cache;
    }

    refreshCache() {
        this.thresholdCache.set(undefined);
    }
}
