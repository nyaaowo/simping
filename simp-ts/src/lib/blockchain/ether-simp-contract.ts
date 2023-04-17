import type { Address } from '$lib/blockchain/address';
import type { SupportedChain } from '$lib/blockchain/chain';
import { etherReceiptToReceipt } from '$lib/blockchain/ether-chain-client';
import {
    MANUAL_GAS_LIMIT,
    MANUAL_MAX_FEE_PER_GAS,
    MANUAL_MAX_PRIORITY_FEE_PER_GAS
} from '$lib/blockchain/manual-gas-estimation';
import {
    eip712DemoteModType,
    eip712PromoteModType,
    eip712SimpDomainSeparator,
    eip712UpdateThresholdType,
    type MerchChange,
    type MerchDonation,
    type MerchStatusApproval,
    type ModChange,
    type ModThresholdChange,
    type SimpContract,
    type SimpGasEstimationContract,
    type SimpViewContract,
    type SimpViewEventContract,
    type TextDonation
} from '$lib/blockchain/simp-contract';
import {
    populateTransaction,
    type Fee,
    type TransactionOptions
} from '$lib/blockchain/transaction/transaction-options';
import type { TransactionResult } from '$lib/blockchain/transaction/transaction-result';
import {
    etherToWei,
    randomEthersProvider,
    signaturesStringToSortedSignatures,
    weiToEther
} from '$lib/blockchain/utils';
import type { Merch } from '$lib/merch/merch';
import { Simp__factory, type Simp } from '$lib/types/ethers-contract';
import type { SimpleEvent } from '$lib/utils/event-emitter';
import { dateToSecond, type Timestamp } from '$lib/utils/timestamp';
import type Big from 'big.js';
import { ethers, type ContractTransactionResponse, type Provider, type Signer } from 'ethers';
import type { ProviderEvent } from 'ethers/types/providers';

const SECOND_TO_MILLISECOND = 1000;

class EtherSimpViewEventContract implements SimpViewEventContract {
    private provider: Provider;
    private contract: Simp;

    constructor(provider: Provider, contract: Simp) {
        this.provider = provider;
        this.contract = contract;
    }

    textDonation(): SimpleEvent {
        return toSimpleEvent(this.provider, this.contract.filters.TTSDonated().fragment.topicHash);
    }

    donation(simp?: Address, merchId?: number): SimpleEvent {
        return toSimpleEvent(
            this.provider,
            this.contract.filters.Donated(simp, merchId).fragment.topicHash
        );
    }

    refund(simp?: Address, merchId?: number): SimpleEvent {
        return toSimpleEvent(
            this.provider,
            this.contract.filters.Refunded(simp, merchId).fragment.topicHash
        );
    }

    releaseApproval(approver?: Address, merchId?: number): SimpleEvent {
        return toSimpleEvent(
            this.provider,
            this.contract.filters.ReleaseApproved(approver, merchId).fragment.topicHash
        );
    }

    refundApproval(approver?: Address, merchId?: number): SimpleEvent {
        return toSimpleEvent(
            this.provider,
            this.contract.filters.RefundApproved(approver, merchId).fragment.topicHash
        );
    }

    merchUpdate(merchId?: number): SimpleEvent {
        return toSimpleEvent(
            this.provider,
            this.contract.filters.MerchChanged(merchId).fragment.topicHash
        );
    }

    modUpdate(mod?: Address): SimpleEvent {
        return toSimpleEvent(
            this.provider,
            this.contract.filters.ModChanged(undefined, mod).fragment.topicHash
        );
    }

    modThresholdUpdate(): SimpleEvent {
        return toSimpleEvent(
            this.provider,
            this.contract.filters.ThresholdUpdated().fragment.topicHash
        );
    }
}

class EtherSimpGasEstimationContract implements SimpGasEstimationContract {
    private contract: Simp;
    private provider: Provider;
    private sender: Address;

    constructor(sender: Address, provider: Provider, contract: Simp) {
        this.provider = provider;
        this.sender = sender;
        this.contract = contract;
    }

    private async gasLimitToFee(gasLimit: bigint): Promise<Fee> {
        let fee: Fee;
        try {
            const feeData = await this.provider.getFeeData();
            fee = {
                maxFeePerGas:
                    feeData.maxFeePerGas != undefined
                        ? weiToEther(feeData.maxFeePerGas)
                        : undefined,
                maxPriorityFeePerGas:
                    feeData.maxPriorityFeePerGas != undefined
                        ? weiToEther(feeData.maxPriorityFeePerGas)
                        : undefined,
                gasLimit: gasLimit
            };
        } catch (error) {
            fee = {
                maxFeePerGas: MANUAL_MAX_FEE_PER_GAS,
                maxPriorityFeePerGas: MANUAL_MAX_PRIORITY_FEE_PER_GAS,
                gasLimit: gasLimit
            };
        }
        return fee;
    }

    async donate(id: number): Promise<Fee> {
        let gasLimit: bigint;
        try {
            gasLimit = await this.contract.donate.estimateGas(id, { from: this.sender });
        } catch (error) {
            gasLimit = MANUAL_GAS_LIMIT.donate;
        }
        return this.gasLimitToFee(gasLimit);
    }
    async donateTts(message: string): Promise<Fee> {
        let gasLimit: bigint;
        try {
            gasLimit = await this.contract.donateTTS.estimateGas(message, { from: this.sender });
        } catch (error) {
            gasLimit = MANUAL_GAS_LIMIT.donateTts;
        }
        return this.gasLimitToFee(gasLimit);
    }
    async releaseFund(id: number): Promise<Fee> {
        let gasLimit: bigint;
        try {
            gasLimit = await this.contract.releaseFund.estimateGas(id, { from: this.sender });
        } catch (error) {
            gasLimit = MANUAL_GAS_LIMIT.releaseFund;
        }
        return this.gasLimitToFee(gasLimit);
    }
    async approveRefund(id: number): Promise<Fee> {
        let gasLimit: bigint;
        try {
            gasLimit = await this.contract.approveRefund.estimateGas(id, { from: this.sender });
        } catch (error) {
            gasLimit = MANUAL_GAS_LIMIT.approveRefund;
        }
        return this.gasLimitToFee(gasLimit);
    }
    async refund(id: number, simp: string): Promise<Fee> {
        let gasLimit: bigint;
        try {
            gasLimit = await this.contract.refund.estimateGas(id, simp, { from: this.sender });
        } catch (error) {
            gasLimit = MANUAL_GAS_LIMIT.refund;
        }
        return this.gasLimitToFee(gasLimit);
    }
    async createMerch(name: string, imageUrl: string, target: Big, expiry: Date): Promise<Fee> {
        let gasLimit: bigint;
        try {
            gasLimit = await this.contract.createMerch.estimateGas(
                name,
                imageUrl,
                etherToWei(target),
                dateToSecond(expiry),
                { from: this.sender }
            );
        } catch (error) {
            gasLimit = MANUAL_GAS_LIMIT.createMerch;
        }
        return this.gasLimitToFee(gasLimit);
    }
    async updateMerch(
        id: number,
        name: string,
        imageUrl: string,
        target: Big,
        expiry: Date
    ): Promise<Fee> {
        let gasLimit: bigint;
        try {
            gasLimit = await this.contract.updateMerch.estimateGas(
                id,
                name,
                imageUrl,
                etherToWei(target),
                dateToSecond(expiry),
                { from: this.sender }
            );
        } catch (error) {
            gasLimit = MANUAL_GAS_LIMIT.updateMerch;
        }
        return this.gasLimitToFee(gasLimit);
    }
    async abdicate(newQueen: string): Promise<Fee> {
        let gasLimit: bigint;
        try {
            gasLimit = await this.contract.abdicate.estimateGas(newQueen, { from: this.sender });
        } catch (error) {
            gasLimit = MANUAL_GAS_LIMIT.abdicate;
        }
        return this.gasLimitToFee(gasLimit);
    }

    async promoteMod(mod: string, deadline: Timestamp, signatures: string[]): Promise<Fee> {
        const digest = await hashPromoteMod(this.provider, this.contract, mod, deadline);
        const res = signaturesStringToSortedSignatures(digest, signatures);
        let gasLimit: bigint;
        try {
            gasLimit = await this.contract.promoteMod.estimateGas(mod, deadline, res, {
                from: this.sender
            });
        } catch (error) {
            gasLimit = MANUAL_GAS_LIMIT.promoteMod;
        }
        return this.gasLimitToFee(gasLimit);
    }

    async demoteMod(mod: string, deadline: Timestamp, signatures: string[]): Promise<Fee> {
        const digest = await hashDemoteMod(this.provider, this.contract, mod, deadline);
        const res = signaturesStringToSortedSignatures(digest, signatures);
        let gasLimit: bigint;
        try {
            gasLimit = await this.contract.demoteMod.estimateGas(mod, deadline, res, {
                from: this.sender
            });
        } catch (error) {
            gasLimit = MANUAL_GAS_LIMIT.demoteMod;
        }
        return this.gasLimitToFee(gasLimit);
    }

    async updateModThreshold(
        threshold: number,
        deadline: Timestamp,
        signatures: string[]
    ): Promise<Fee> {
        const digest = await hashUpdateThreshold(this.provider, this.contract, threshold, deadline);
        const res = signaturesStringToSortedSignatures(digest, signatures);
        let gasLimit: bigint;
        try {
            gasLimit = await this.contract.updateModThreshold.estimateGas(
                threshold,
                deadline,
                res,
                {
                    from: this.sender
                }
            );
        } catch (error) {
            gasLimit = MANUAL_GAS_LIMIT.updateModThreshold;
        }
        return this.gasLimitToFee(gasLimit);
    }
}

export class EtherSimpViewContract implements SimpViewContract {
    private provider: Provider;
    private contract: Simp;
    event: SimpViewEventContract;
    constructor(initOrReuse: SupportedChain | Provider, contract: Address) {
        if ('name' in initOrReuse) {
            this.provider = randomEthersProvider(initOrReuse);
        } else {
            this.provider = initOrReuse;
        }
        this.contract = Simp__factory.connect(contract, this.provider);
        this.event = new EtherSimpViewEventContract(this.provider, this.contract);
    }

    async modThreshold(): Promise<number> {
        const threshold = await this.contract.modThreshold();
        return Number(threshold);
    }

    async merch(id: number): Promise<Merch> {
        const merch = await this.contract.merchs(id);
        return {
            id: id,
            name: merch.name,
            imageSrc: merch.imageURI,
            currentAmount: weiToEther(merch.amount.toString()),
            targetAmount: weiToEther(merch.target.toString()),
            expiry: new Date(Number(merch.expiry) * SECOND_TO_MILLISECOND)
        };
    }

    async textDonations(): Promise<TextDonation[]> {
        return Promise.all(
            (await this.contract.queryFilter(this.contract.filters.TTSDonated())).map(async (e) => {
                return {
                    simp: e.args[0],
                    message: e.args[1],
                    amount: weiToEther(e.args[2].toString()),
                    timestamp: (await e.getBlock()).timestamp,
                    eventId: {
                        blockHash: e.blockHash,
                        transactionHash: e.transactionHash,
                        logIndex: e.index
                    }
                };
            })
        );
    }

    async donations(simp?: Address, merchId?: number): Promise<MerchDonation[]> {
        return (await this.contract.queryFilter(this.contract.filters.Donated(simp, merchId))).map(
            (e) => {
                return {
                    simp: e.args[0],
                    merchId: Number(e.args[1]),
                    amount: weiToEther(e.args[2].toString())
                } as MerchDonation;
            }
        );
    }

    async refunds(simp?: Address, merchId?: number): Promise<MerchDonation[]> {
        return (await this.contract.queryFilter(this.contract.filters.Refunded(simp, merchId))).map(
            (e) => {
                return {
                    simp: e.args[0],
                    merchId: Number(e.args[1]),
                    amount: weiToEther(e.args[2].toString())
                } as MerchDonation;
            }
        );
    }

    async releaseApprovals(approver?: Address, merchId?: number): Promise<MerchStatusApproval[]> {
        return (
            await this.contract.queryFilter(
                this.contract.filters.ReleaseApproved(approver, merchId)
            )
        ).map((e) => {
            return {
                approver: e.args[0],
                merchId: Number(e.args[1])
            } as MerchStatusApproval;
        });
    }

    async refundApprovals(approver?: Address, merchId?: number): Promise<MerchStatusApproval[]> {
        return (
            await this.contract.queryFilter(this.contract.filters.RefundApproved(approver, merchId))
        ).map((e) => {
            return {
                approver: e.args[0],
                merchId: Number(e.args[1])
            } as MerchStatusApproval;
        });
    }

    async merchUpdates(merchId?: number): Promise<MerchChange[]> {
        return (await this.contract.queryFilter(this.contract.filters.MerchChanged(merchId))).map(
            (e) => {
                return {
                    id: Number(e.args[0]),
                    name: e.args[1],
                    imageURI: e.args[2],
                    target: weiToEther(e.args[3].toString()),
                    expiry: new Date(Number(e.args[4]) * SECOND_TO_MILLISECOND)
                } as MerchChange;
            }
        );
    }

    async modUpdates(mod?: Address): Promise<ModChange[]> {
        return (
            await this.contract.queryFilter(this.contract.filters.ModChanged(undefined, mod))
        ).map((e) => {
            return {
                approvers: e.args[0],
                mod: e.args[1],
                isPromoted: e.args[2]
            } as ModChange;
        });
    }

    async modThresholdUpdates(): Promise<ModThresholdChange[]> {
        return (await this.contract.queryFilter(this.contract.filters.ThresholdUpdated())).map(
            (e) => {
                return {
                    approvers: e.args[0],
                    threshold: Number(e.args[1])
                } as ModThresholdChange;
            }
        );
    }

    async queen(): Promise<Address> {
        return await this.contract.queen();
    }

    async isMod(address: string): Promise<boolean> {
        return await this.contract.isMod(String(address));
    }

    async allMerchs(): Promise<Merch[]> {
        const total = Number(await this.contract.merchCount());
        const res: Merch[] = await Promise.all(
            [...Array(total).keys()].map(async (i): Promise<Merch> => {
                return this.merch(i);
            })
        );

        return res;
    }

    async donatedAmount(id: number, simp: Address): Promise<Big> {
        const amount = (await this.contract.donatedAmount(id, simp)).toString();
        return weiToEther(amount);
    }
}

export class EtherSimpContract implements SimpContract {
    viewContract: EtherSimpViewContract;
    estimateGas: SimpGasEstimationContract;
    private signer: Signer;
    private provider: Provider;
    private contract: Simp;
    constructor(
        initOrReuse:
            | { chain: SupportedChain; privateKey: string }
            | { provider: Provider; signer: Signer },
        sender: Address,
        contract: Address
    ) {
        if ('provider' in initOrReuse) {
            this.signer = initOrReuse.signer;
            this.provider = initOrReuse.provider;
        } else {
            this.provider = randomEthersProvider(initOrReuse.chain);
            this.signer = new ethers.Wallet(initOrReuse.privateKey);
        }
        this.contract = Simp__factory.connect(contract, this.signer);
        this.viewContract = new EtherSimpViewContract(this.provider, contract);
        this.estimateGas = new EtherSimpGasEstimationContract(sender, this.provider, this.contract);
    }

    async signPromoteMod(mod: Address, deadline: number): Promise<string> {
        const digest = await hashPromoteMod(this.provider, this.contract, mod, deadline);
        return await this.signer.signMessage(ethers.toUtf8Bytes(digest));
    }

    async signDemoteMod(mod: Address, deadline: number): Promise<string> {
        const digest = await hashDemoteMod(this.provider, this.contract, mod, deadline);
        return await this.signer.signMessage(ethers.toUtf8Bytes(digest));
    }

    async signUpdateModThreshold(threshold: number, deadline: number): Promise<string> {
        const digest = await hashUpdateThreshold(this.provider, this.contract, threshold, deadline);
        return await this.signer.signMessage(ethers.toUtf8Bytes(digest));
    }

    async donate(
        id: number,
        amount: Big,
        override?: TransactionOptions
    ): Promise<TransactionResult> {
        const tx = await this.contract.donate(id, {
            value: etherToWei(amount),
            ...populateTransaction(override)
        });
        return this.processTx(tx);
    }

    async donateTts(
        message: string,
        amount: Big,
        override?: TransactionOptions
    ): Promise<TransactionResult> {
        const tx = await this.contract.donateTTS(message, {
            value: etherToWei(amount),
            ...populateTransaction(override)
        });
        return this.processTx(tx);
    }

    async releaseFund(id: number, override?: TransactionOptions): Promise<TransactionResult> {
        const tx = await this.contract.releaseFund(id, { ...populateTransaction(override) });
        return this.processTx(tx);
    }

    async approveRefund(id: number, override?: TransactionOptions): Promise<TransactionResult> {
        const tx = await this.contract.approveRefund(id, { ...populateTransaction(override) });
        return this.processTx(tx);
    }

    async refund(
        id: number,
        simp: Address,
        override?: TransactionOptions
    ): Promise<TransactionResult> {
        const tx = await this.contract.refund(id, simp, { ...populateTransaction(override) });
        return this.processTx(tx);
    }

    async createMerch(
        name: string,
        imageUrl: string,
        target: Big,
        expiry: Date,
        override?: TransactionOptions
    ): Promise<TransactionResult> {
        const tx = await this.contract.createMerch(
            name,
            imageUrl,
            etherToWei(target),
            expiry.getTime() / SECOND_TO_MILLISECOND,
            { ...populateTransaction(override) }
        );
        return this.processTx(tx);
    }

    async updateMerch(
        id: number,
        name: string,
        imageUrl: string,
        target: Big,
        expiry: Date,
        override?: TransactionOptions
    ): Promise<TransactionResult> {
        const tx = await this.contract.updateMerch(
            id,
            name,
            imageUrl,
            etherToWei(target),
            expiry.getTime() / SECOND_TO_MILLISECOND,
            { ...populateTransaction(override) }
        );
        return this.processTx(tx);
    }

    async abdicate(newQueen: Address, override?: TransactionOptions): Promise<TransactionResult> {
        const tx = await this.contract.abdicate(newQueen, { ...populateTransaction(override) });
        return this.processTx(tx);
    }

    async promoteMod(
        mod: Address,
        deadline: Timestamp,
        signatures: string[],
        override?: TransactionOptions
    ): Promise<TransactionResult> {
        const digest = await hashPromoteMod(this.provider, this.contract, mod, deadline);
        const newSignature = await this.signer.signMessage(ethers.toUtf8Bytes(digest));
        const res = signaturesStringToSortedSignatures(digest, signatures.concat(newSignature));

        const tx = await this.contract.promoteMod(mod, deadline, res, {
            ...populateTransaction(override)
        });
        return this.processTx(tx);
    }

    async demoteMod(
        mod: Address,
        deadline: Timestamp,
        signatures: string[],
        override?: TransactionOptions
    ): Promise<TransactionResult> {
        const digest = await hashDemoteMod(this.provider, this.contract, mod, deadline);
        const newSignature = await this.signer.signMessage(ethers.toUtf8Bytes(digest));
        const res = signaturesStringToSortedSignatures(digest, signatures.concat(newSignature));

        const tx = await this.contract.demoteMod(mod, deadline, res, {
            ...populateTransaction(override)
        });
        return this.processTx(tx);
    }

    async updateModThreshold(
        threshold: number,
        deadline: Timestamp,
        signatures: string[],
        override?: TransactionOptions
    ): Promise<TransactionResult> {
        const digest = await hashUpdateThreshold(this.provider, this.contract, threshold, deadline);
        const newSignature = await this.signer.signMessage(ethers.toUtf8Bytes(digest));
        const res = signaturesStringToSortedSignatures(digest, signatures.concat(newSignature));

        const tx = await this.contract.updateModThreshold(threshold, deadline, res, {
            ...populateTransaction(override)
        });
        return this.processTx(tx);
    }

    private processTx(tx: ContractTransactionResponse): TransactionResult {
        return {
            hash: tx.hash,
            wait: async () => {
                const result = await tx.wait();
                if (result != null) {
                    return etherReceiptToReceipt(result);
                } else {
                    return undefined;
                }
            }
        };
    }
}

async function hashPromoteMod(
    provider: Provider,
    contract: Simp,
    mod: Address,
    deadline: number
): Promise<string> {
    const chainId = (await provider.getNetwork()).chainId;
    const contractAddress = await contract.getAddress();
    const digest = ethers.TypedDataEncoder.hash(
        eip712SimpDomainSeparator(chainId, contractAddress),
        eip712PromoteModType,
        { _mod: mod, _deadline: deadline }
    );
    return digest;
}

async function hashDemoteMod(
    provider: Provider,
    contract: Simp,
    mod: Address,
    deadline: number
): Promise<string> {
    const chainId = (await provider.getNetwork()).chainId;
    const contractAddress = await contract.getAddress();
    const digest = ethers.TypedDataEncoder.hash(
        eip712SimpDomainSeparator(chainId, contractAddress),
        eip712DemoteModType,
        { _mod: mod, _deadline: deadline }
    );
    return digest;
}

async function hashUpdateThreshold(
    provider: Provider,
    contract: Simp,
    threshold: number,
    deadline: number
): Promise<string> {
    const chainId = (await provider.getNetwork()).chainId;
    const contractAddress = await contract.getAddress();
    const digest = ethers.TypedDataEncoder.hash(
        eip712SimpDomainSeparator(chainId, contractAddress),
        eip712UpdateThresholdType,
        { _threshold: threshold, _deadline: deadline }
    );
    return digest;
}

function toSimpleEvent(provider: Provider, event: ProviderEvent): SimpleEvent {
    return {
        on: (listener: () => void) => {
            provider.on(event, listener);
        },
        off: (listener: () => void) => {
            provider.off(event, listener);
        }
    };
}
