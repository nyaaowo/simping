<script lang="ts">
    import type { Address } from '$lib/blockchain/address';
    import type { MerchStatus } from '$lib/merch/merch';
    import Merch from '$lib/merch/Merch.svelte';
    import { Group } from '@svelteuidev/core';
    import type Big from 'big.js';
    import type { Readable } from 'svelte/store';

    export let merchs: {
        id: number;
        name: string;
        imageSrc: URL | string | undefined;
        current: Big;
        target: Big;
        expiry: Date;
        status: MerchStatus;
    }[];

    export let currentAddress: Address | undefined;
    export let refundableAmount: (id: number, donor: Address) => Readable<Big>;
    export let onSelect: (id: number) => void;
</script>

<Group>
    {#each merchs as merch (merch.id)}
        <Merch {currentAddress} {refundableAmount} {onSelect} {...merch} />
    {/each}
</Group>
