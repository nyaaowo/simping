import type { Readable } from 'svelte/store';

export interface GovernanceViewRepository {
    modThreshold(): Promise<number>;
}

export interface GovernanceViewCachingRepository extends GovernanceViewRepository {
    currentModThreshold(): Readable<number>;
    refreshCache(): void;
}
