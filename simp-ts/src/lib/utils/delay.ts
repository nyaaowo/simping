/**
 * Debounce the input function
 *
 * @param func function to be debounced
 * @param delay delay duration in millisecond
 * @returns
 */
export function debounce<F extends (...args: Parameters<F>) => ReturnType<F>>(
    func: F,
    delay: number
) {
    let timeout: ReturnType<typeof setTimeout> | undefined;

    return function (...args: Parameters<F>) {
        clearTimeout(timeout);
        timeout = setTimeout(() => func(...args), delay);
    };
}
