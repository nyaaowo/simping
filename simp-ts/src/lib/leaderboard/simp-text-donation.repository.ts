import type { SimpViewContract } from '$lib/blockchain/simp-contract';
import type TextDonation from '$lib/leaderboard/text-donation';
import {
    sortTextDonationHighest,
    sortTextDonationRecent,
    type TextDonationSortOption,
    type TextDonationViewCachingRepository,
    type TextDonationViewRepository
} from '$lib/leaderboard/text-donation.repository';
import { derived, get, writable, type Readable, type Writable } from 'svelte/store';

export class SimpTextDonationViewRepository implements TextDonationViewRepository {
    private contract: SimpViewContract;
    constructor(contract: SimpViewContract) {
        this.contract = contract;
    }

    donations(
        sortOption: TextDonationSortOption,
        limit?: number | undefined
    ): Promise<TextDonation[]> {
        if (sortOption === 'Recent') {
            return this.recentDonations(limit);
        } else {
            return this.highestDonations(limit);
        }
    }

    private async recentDonations(limit?: number): Promise<TextDonation[]> {
        let donations = (await this.contract.textDonations()).map((e) => {
            return {
                message: e.message,
                amount: e.amount,
                donor: e.simp,
                timestamp: e.timestamp,
                id: e.eventId
            };
        });
        donations = sortTextDonationRecent(donations);
        if (limit !== undefined) {
            donations.length = Math.min(donations.length, limit);
        }
        return donations;
    }

    private async highestDonations(limit?: number): Promise<TextDonation[]> {
        let donations = (await this.contract.textDonations()).map((e) => {
            return {
                message: e.message,
                amount: e.amount,
                donor: e.simp,
                timestamp: e.timestamp,
                id: e.eventId
            };
        });
        donations = sortTextDonationHighest(donations);
        if (limit !== undefined) {
            donations.length = Math.min(donations.length, limit);
        }
        return donations;
    }
}

export class SimpTextDonationViewCachingRepository implements TextDonationViewCachingRepository {
    private repo: SimpTextDonationViewRepository;
    // store as recent
    private donationCache: Writable<TextDonation[] | undefined> = writable(undefined);
    constructor(contract: SimpViewContract) {
        this.repo = new SimpTextDonationViewRepository(contract);
    }

    currentDonations(
        sortOption: TextDonationSortOption,
        limit?: number | undefined
    ): Readable<TextDonation[]> {
        return derived(this.donationCache, (donations) => {
            if (donations == undefined) {
                setTimeout(() => {
                    this.donations('Recent');
                }, 0);

                return [];
            }
            if (sortOption === 'Highest') {
                donations = sortTextDonationHighest(donations);
            } else if (sortOption === 'Recent') {
                donations = sortTextDonationRecent(donations);
            }
            return donations.slice(0, limit);
        });
    }

    async donations(
        sortOption: TextDonationSortOption,
        limit?: number | undefined
    ): Promise<TextDonation[]> {
        let cache = get(this.donationCache);
        if (cache == undefined) {
            const donations = await this.repo.donations('Recent');
            this.donationCache.set(donations);
            cache = donations;
        }
        if (sortOption === 'Highest') {
            cache = sortTextDonationHighest(cache);
        }
        return cache.slice(0, limit);
    }

    refreshCache() {
        this.donationCache.set(undefined);
    }
}
