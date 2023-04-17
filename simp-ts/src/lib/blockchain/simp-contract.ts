import type { Address } from '$lib/blockchain/address';
import type { EventId } from '$lib/blockchain/event';
import type { Fee, TransactionOptions } from '$lib/blockchain/transaction/transaction-options';
import type { TransactionResult } from '$lib/blockchain/transaction/transaction-result';
import type { Merch } from '$lib/merch/merch';
import type { SimpleEvent } from '$lib/utils/event-emitter';
import type { Timestamp } from '$lib/utils/timestamp';
import type Big from 'big.js';

export interface SimpViewEventContract {
    textDonation(): SimpleEvent;
    donation(simp?: Address, merchId?: number): SimpleEvent;
    refund(simp?: Address, merchId?: number): SimpleEvent;
    releaseApproval(approver?: Address, merchId?: number): SimpleEvent;
    refundApproval(approver?: Address, merchId?: number): SimpleEvent;
    merchUpdate(merchId?: number): SimpleEvent;
    modUpdate(mod?: Address): SimpleEvent;
    modThresholdUpdate(): SimpleEvent;
}

export interface SimpGasEstimationContract {
    donate(id: number, amount: Big): Promise<Fee>;
    donateTts(message: string, amount: Big): Promise<Fee>;
    releaseFund(id: number): Promise<Fee>;
    approveRefund(id: number): Promise<Fee>;
    refund(id: number, simp: Address): Promise<Fee>;
    createMerch(name: string, imageUrl: string, target: Big, expiry: Date): Promise<Fee>;
    updateMerch(
        id: number,
        name: string,
        imageUrl: string,
        target: Big,
        expiry: Date
    ): Promise<Fee>;
    abdicate(newQueen: Address): Promise<Fee>;
    promoteMod(mod: Address, deadline: Timestamp, signatures: string[]): Promise<Fee>;
    demoteMod(mod: Address, deadline: Timestamp, signatures: string[]): Promise<Fee>;
    updateModThreshold(threshold: number, deadline: Timestamp, signatures: string[]): Promise<Fee>;
}

export interface SimpViewContract {
    event: SimpViewEventContract;
    allMerchs(): Promise<Merch[]>;
    merch(id: number): Promise<Merch>;
    queen(): Promise<Address>;
    isMod(address: Address): Promise<boolean>;
    donatedAmount(id: number, simp: Address): Promise<Big>;
    modThreshold(): Promise<number>;
    textDonations(): Promise<TextDonation[]>;
    donations(simp?: Address, merchId?: number): Promise<MerchDonation[]>;
    refunds(simp?: Address, merchId?: number): Promise<MerchDonation[]>;
    releaseApprovals(approver?: Address, merchId?: number): Promise<MerchStatusApproval[]>;
    refundApprovals(approver?: Address, merchId?: number): Promise<MerchStatusApproval[]>;
    merchUpdates(merchId?: number): Promise<MerchChange[]>;
    modUpdates(mod?: Address): Promise<ModChange[]>;
    modThresholdUpdates(): Promise<ModThresholdChange[]>;
}

export interface SimpContract {
    viewContract: SimpViewContract;
    estimateGas: SimpGasEstimationContract;
    donate(id: number, amount: Big, override?: TransactionOptions): Promise<TransactionResult>;
    donateTts(
        message: string,
        amount: Big,
        override?: TransactionOptions
    ): Promise<TransactionResult>;
    releaseFund(id: number, override?: TransactionOptions): Promise<TransactionResult>;
    approveRefund(id: number, override?: TransactionOptions): Promise<TransactionResult>;
    refund(id: number, simp: Address, override?: TransactionOptions): Promise<TransactionResult>;
    createMerch(
        name: string,
        imageUrl: string,
        target: Big,
        expiry: Date,
        override?: TransactionOptions
    ): Promise<TransactionResult>;
    updateMerch(
        id: number,
        name: string,
        imageUrl: string,
        target: Big,
        expiry: Date,
        override?: TransactionOptions
    ): Promise<TransactionResult>;
    abdicate(newQueen: Address, override?: TransactionOptions): Promise<TransactionResult>;
    promoteMod(
        mod: Address,
        deadline: Timestamp,
        signatures: string[],
        override?: TransactionOptions
    ): Promise<TransactionResult>;
    demoteMod(
        mod: Address,
        deadline: Timestamp,
        signatures: string[],
        override?: TransactionOptions
    ): Promise<TransactionResult>;
    updateModThreshold(
        threshold: number,
        deadline: Timestamp,
        signatures: string[],
        override?: TransactionOptions
    ): Promise<TransactionResult>;
    signPromoteMod(mod: Address, deadline: Timestamp): Promise<string>;
    signDemoteMod(mod: Address, deadline: Timestamp): Promise<string>;
    signUpdateModThreshold(threshold: number, deadline: Timestamp): Promise<string>;
}

export function eip712SimpDomainSeparator(
    chainId: bigint,
    contract: Address
): {
    name: string;
    version: string;
    chainId: bigint;
    verifyingContract: string;
} {
    return {
        name: 'Simp',
        version: '1',
        chainId: chainId,
        verifyingContract: contract as string
    };
}

export const eip712PromoteModType = {
    PromoteMod: [
        { name: '_mod', type: 'address' },
        { name: '_deadline', type: 'uint256' }
    ]
};

export const eip712DemoteModType = {
    DemoteMod: [
        { name: '_mod', type: 'address' },
        { name: '_deadline', type: 'uint256' }
    ]
};

export const eip712UpdateThresholdType = {
    UpdateThreshold: [
        { name: '_threshold', type: 'uint256' },
        { name: '_deadline', type: 'uint256' }
    ]
};

export interface TextDonation {
    simp: Address;
    message: string;
    amount: Big;
    timestamp: Timestamp;
    eventId: EventId;
}

export interface MerchDonation {
    simp: Address;
    merchId: number;
    amount: Big;
}

export interface MerchStatusApproval {
    approver: Address;
    merchId: number;
}

export interface MerchChange {
    id: number;
    name: string;
    imageURI: string;
    target: Big;
    expiry: Date;
}

export interface ModChange {
    approvers: Address[];
    mod: Address;
    isPromoted: boolean;
}

export interface ModThresholdChange {
    approvers: Address[];
    threshold: number;
}
