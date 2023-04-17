import { weiToEther } from '$lib/blockchain/utils';

export const MANUAL_MAX_FEE_PER_GAS = weiToEther(BigInt(0.1 * 10 ** 9));
export const MANUAL_MAX_PRIORITY_FEE_PER_GAS = weiToEther(BigInt(0.1 * 10 ** 9));

// data taken from foundry gas report
export const MANUAL_GAS_LIMIT: {
    abdicate: bigint;
    approveRefund: bigint;
    createMerch: bigint;
    updateMerch: bigint;
    promoteMod: bigint;
    demoteMod: bigint;
    updateModThreshold: bigint;
    donate: bigint;
    donateTts: bigint;
    refund: bigint;
    releaseFund: bigint;
} = {
    donate: 57959n,
    donateTts: 20000n,

    createMerch: 119095n,
    updateMerch: 32488n,

    abdicate: 5549n,
    promoteMod: 47282n,
    demoteMod: 25393n,
    updateModThreshold: 24407n,

    refund: 28398n,
    approveRefund: 7252n,
    releaseFund: 45531n
};
