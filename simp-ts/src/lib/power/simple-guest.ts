import type { SimpViewContract } from '$lib/blockchain/simp-contract';
import type { GovernanceViewCachingRepository } from '$lib/governance/governance.repository';
import { SimpGovernanceViewCachingRepository } from '$lib/governance/simp-governance.repository';
import { SimpTextDonationViewCachingRepository } from '$lib/leaderboard/simp-text-donation.repository';
import type { TextDonationViewCachingRepository } from '$lib/leaderboard/text-donation.repository';
import type { MerchViewCachingRepository } from '$lib/merch/merch.repository';
import { SimpMerchViewCachingRepository } from '$lib/merch/simp-merch.repository';
import type Guest from '$lib/power/guest';
import type { RoleViewCachingRepository } from '$lib/power/role.repository';
import { SimpRoleViewCachingRepository } from '$lib/power/simp-role.repository';

export default class SimpleGuest implements Guest {
    textDonationView: TextDonationViewCachingRepository;
    roleView: RoleViewCachingRepository;
    merchView: MerchViewCachingRepository;
    governanceView: GovernanceViewCachingRepository;

    constructor(contract: SimpViewContract) {
        this.textDonationView = new SimpTextDonationViewCachingRepository(contract);
        this.roleView = new SimpRoleViewCachingRepository(contract);
        this.merchView = new SimpMerchViewCachingRepository(contract);
        this.governanceView = new SimpGovernanceViewCachingRepository(contract);
    }
}
