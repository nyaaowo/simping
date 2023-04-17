import type { KeyedSimpleNotification, SimpleNotification } from '$lib/notification/notification';
import { writable } from 'svelte/store';

/**
 * Duration of notification in millisecond
 */
const NOTIFICATION_DURATION = 4000;

function createDefaultNotificationQueue() {
    const { subscribe, update } = writable<KeyedSimpleNotification[]>([]);

    return {
        subscribe,
        send: (notification: SimpleNotification) => {
            update((state) => {
                state.unshift({
                    ...notification,
                    id: (state.at(-1)?.id ?? -1) + 1
                });
                return state;
            });
            setTimeout(() => {
                update((state) => {
                    state.pop();
                    return state;
                });
            }, NOTIFICATION_DURATION);
        }
    };
}

export const defaultNotificationQueue = createDefaultNotificationQueue();
