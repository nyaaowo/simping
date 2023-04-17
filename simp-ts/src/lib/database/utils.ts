import type { Observable } from 'dexie';
import type { Readable, Subscriber, Unsubscriber } from 'svelte/store';

declare module 'dexie' {
    interface Observable<T> {
        subscribe(run: Subscriber<T>): Unsubscriber | Subscription;
    }
}

export function dexieObservableToReadable<T>(observable: Observable<T>): Readable<T> {
    return observable as Readable<T>;
}
