import type TextDonation from '$lib/leaderboard/text-donation';
import type { Readable } from 'svelte/store';

export type TextDonationSortOption = 'Recent' | 'Highest';

export interface TextDonationViewRepository {
    donations(sortOption: TextDonationSortOption, limit?: number): Promise<TextDonation[]>;
}

export interface TextDonationViewCachingRepository extends TextDonationViewRepository {
    currentDonations(sortOption: TextDonationSortOption, limit?: number): Readable<TextDonation[]>;
    refreshCache(): void;
}

export interface TextDonationRepository {
    view: TextDonationViewRepository;
}

export function sortTextDonationHighest(donations: TextDonation[]): TextDonation[] {
    return donations.sort((a, b) => {
        return b.amount.minus(a.amount).toNumber();
    });
}

export function sortTextDonationRecent(donations: TextDonation[]): TextDonation[] {
    return donations.sort((a, b) => {
        return b.timestamp - a.timestamp;
    });
}
