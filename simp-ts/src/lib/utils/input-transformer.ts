import type { Address } from '$lib/blockchain/address';
import { CONFIG } from '$lib/config/config';
import { dateToSecond, type Timestamp } from '$lib/utils/timestamp';
import Big from 'big.js';

/**
 * Returns url string if the input url string is valid and whitelisted
 *
 * @param url input url string to be parsed
 * @returns url string and empty error string if valid, undefined and error string if invalid
 */
export function parseWhitelistedImageUrl(url?: string | URL): {
    src: string | undefined;
    error: string;
} {
    if (url == undefined) {
        return { src: undefined, error: '' };
    }

    if (url == '') {
        return { src: undefined, error: 'No image provided' };
    }

    let parsedUrl: URL;
    try {
        parsedUrl = typeof url === 'string' ? new URL(url) : url;
    } catch (error) {
        return { src: undefined, error: 'Invalid url format' };
    }

    for (let pattern of CONFIG.whitelistedImageUrls) {
        pattern = pattern.startsWith('^') ? pattern : `^${pattern}`;
        pattern = pattern.endsWith('$') ? pattern : `${pattern}$`;
        const regex = new RegExp(pattern);
        if (url.toString().match(regex) !== null) {
            return { src: parsedUrl.toString(), error: '' };
        }
    }
    return { src: undefined, error: 'Url not whitelisted' };
}

/**
 * Return amount of provided string if it is a non negative number else return error.
 *
 * @param value number to be parsed
 */
export function parseAmount(value: string): { value: Big; error: string } {
    try {
        const number = Big(value);
        if (number >= Big(0)) {
            return { value: number, error: '' };
        } else {
            return { value: Big(0), error: 'Require non-negative value' };
        }
    } catch (error) {
        return { value: Big(0), error: 'Invalid value' };
    }
}

/**
 * Return date if it is in correct format.
 *
 * @param value date string to be parsed
 */
export function parseDate(value: string): { value: Date; error: string } {
    try {
        const date = new Date(value);
        return { value: date, error: '' };
    } catch (error) {
        return { value: new Date(), error: 'Invalid date time format' };
    }
}

/**
 * Return utc timestamp in seconds if it is in correct format.
 *
 * @param value time in seconds to be parsed
 */
export function parseTimestamp(value: string | Date): { value: Timestamp; error: string } {
    if (typeof value === 'string') {
        try {
            return { value: Number(value), error: '' };
        } catch (error) {
            return { value: 0, error: 'Invalid number' };
        }
    } else {
        return { value: dateToSecond(value), error: '' };
    }
}

/**
 * Return address if it is in correct format.
 *
 * @param value address to be parsed
 */
export function parseAddress(value: string): { value: Address; error: string } {
    // TODO: implement check
    return { value: value, error: '' };
}

/**
 * Return signatures separated by newline.
 *
 * @param value signatures to be parsed
 */
export function parseSignatures(value: string): { value: string[]; error: string } {
    // TODO: implement signature check
    return { value: value.split(/\r?\n/), error: '' };
}

/**
 * Return number from string.
 *
 * @param value number to be parsed
 */
export function parseNumber(value: string, isInt = false): { value: number; error: string } {
    const n = isInt ? parseInt(value, 10) : Number(value);
    return {
        value: n,
        error: isNaN(n) ? (isInt ? 'Not a valid integer' : 'Not a valid number') : ''
    };
}
