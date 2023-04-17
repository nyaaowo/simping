import type { Address } from '$lib/blockchain/address';
import type { EventId } from '$lib/blockchain/event';
import type { Timestamp } from '$lib/utils/timestamp';
import type Big from 'big.js';

export default interface TextDonation {
    message: string;
    amount: Big;
    donor: Address;
    timestamp: Timestamp;
    id: EventId;
}
