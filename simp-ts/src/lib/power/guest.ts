import type { GovernanceViewCachingRepository } from '$lib/governance/governance.repository';
import type { TextDonationViewCachingRepository } from '$lib/leaderboard/text-donation.repository';
import type { MerchViewCachingRepository } from '$lib/merch/merch.repository';
import type { RoleViewCachingRepository } from '$lib/power/role.repository';

export default interface Guest {
    textDonationView: TextDonationViewCachingRepository;
    roleView: RoleViewCachingRepository;
    merchView: MerchViewCachingRepository;
    governanceView: GovernanceViewCachingRepository;
}
