import type { Address } from '$lib/blockchain/address';
import type { ChainClient } from '$lib/blockchain/chain-client';
import type { SimpContract } from '$lib/blockchain/simp-contract';
import { DexieTransactionHistoryRepository } from '$lib/blockchain/transaction/dexie-transaction-history.repository';
import { transactionQueue } from '$lib/blockchain/transaction/transaction-queue';
import { TransactionServices } from '$lib/blockchain/transaction/transaction-services';
import { TransactionWaiter } from '$lib/blockchain/transaction/transaction-waiter';
import type { GovernanceViewCachingRepository } from '$lib/governance/governance.repository';
import { SimpGovernanceViewCachingRepository } from '$lib/governance/simp-governance.repository';
import { SimpTextDonationViewCachingRepository } from '$lib/leaderboard/simp-text-donation.repository';
import type { TextDonationViewCachingRepository } from '$lib/leaderboard/text-donation.repository';
import type { MerchViewCachingRepository } from '$lib/merch/merch.repository';
import { SimpMerchViewCachingRepository } from '$lib/merch/simp-merch.repository';
import type Guest from '$lib/power/guest';
import type { RoleViewCachingRepository } from '$lib/power/role.repository';
import { SimpRoleViewCachingRepository } from '$lib/power/simp-role.repository';
import { WalletServices } from '$lib/wallet/wallet-services';

export default class User implements Guest {
    private client: ChainClient;
    private contract: SimpContract;
    constructor(address: Address, client: ChainClient, contract: SimpContract) {
        this.client = client;
        this.contract = contract;
        this.textDonationView = new SimpTextDonationViewCachingRepository(
            this.contract.viewContract
        );
        this.roleView = new SimpRoleViewCachingRepository(this.contract.viewContract);

        const transactionHistoriesRepo = new DexieTransactionHistoryRepository();
        this.transactionServices = new TransactionServices(
            contract,
            transactionQueue,
            transactionHistoriesRepo,
            new TransactionWaiter(transactionHistoriesRepo, this.client)
        );

        this.walletServices = new WalletServices(client, address);
        this.merchView = new SimpMerchViewCachingRepository(this.contract.viewContract);
        this.governanceView = new SimpGovernanceViewCachingRepository(this.contract.viewContract);
    }

    governanceView: GovernanceViewCachingRepository;
    textDonationView: TextDonationViewCachingRepository;
    roleView: RoleViewCachingRepository;
    merchView: MerchViewCachingRepository;
    transactionServices: TransactionServices;
    walletServices: WalletServices;
}
