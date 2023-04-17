import { error } from '@sveltejs/kit';

export const prerender = false;

export function load({ params }) {
    const n = parseInt(params.id);
    if (!isNaN(n)) {
        return {
            props: {
                id: n
            }
        };
    }

    throw error(400, 'Invalid id');
}
