import Big from 'big.js';

export interface Merch {
    id: number;
    name: string;
    imageSrc: string;
    currentAmount: Big;
    targetAmount: Big;
    expiry: Date;
}

export function merchStatus(merch: Merch): MerchStatus {
    const currentTime = new Date();
    // not expired
    if (merch.expiry > currentTime) {
        return 'Active';
        // expired and has remaining fund = refundable
    } else if (merch.expiry < currentTime && merch.currentAmount > Big(0)) {
        return 'Refundable';
    } else {
        // expired but has no fund = completed
        return 'Completed';
    }
}

export type MerchStatus = 'Active' | 'Refundable' | 'Completed';

export function validateExpiry(newExpiry: Date, merch: { expiry: Date }): void | Error {
    if (newExpiry >= merch.expiry) {
        return;
    } else {
        return Error(`Must not be earlier than ${merch.expiry}`);
    }
}
