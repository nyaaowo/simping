import type Big from 'big.js';

/**
 * Default significant digits of amount of cryptocurrency shown
 */
const SIGNIFICANT_DIGITS = 5;

/**
 * Returns the formatted `Big` using default settings
 *
 * @param value big number to be formatted
 * @returns formatted string of big
 */
export function toDefaultFormat(value: Big): string {
    return value.toPrecision(SIGNIFICANT_DIGITS);
}
