/**
 * UTC timestamp in seconds
 */
export type Timestamp = number;

export function dateToSecond(date: Date): number {
    return Math.round(date.getTime() / 1000);
}
