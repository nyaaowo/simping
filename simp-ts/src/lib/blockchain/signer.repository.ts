import { writable } from 'svelte/store';
import { Key } from '../database/local-storage';

function createSignerRepository() {
    const storedString = localStorage.getItem(Key.PrivateKey);
    const { subscribe, set } = writable<string | undefined>(storedString ?? undefined);

    return {
        subscribe,
        set: (key: string) => {
            set(key);
            localStorage.setItem(Key.PrivateKey, key);
        },
        delete: () => {
            localStorage.removeItem(Key.PrivateKey);
            set(undefined);
        }
    };
}

export const signerRepository = createSignerRepository();
