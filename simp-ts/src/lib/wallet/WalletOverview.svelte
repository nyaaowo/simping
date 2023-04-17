<script lang="ts">
    import type { Address } from '$lib/blockchain/address';
    import TransactionHistory from '$lib/wallet/TransactionHistory.svelte';
    import { Stack, Text } from '@svelteuidev/core';
    import type Big from 'big.js';

    export let account: Address;
    export let balance: Big;
    export let histories: Promise<
        {
            hash: string;
            status: 'Success' | 'Pending' | 'Failure';
            title: string;
            amount: Big;
            date: Date;
        }[]
    >;
</script>

<Stack>
    <Text weight="extralight">Wallet {String(account)}</Text>
    <Text size="xl" weight="semibold">💰 {balance}</Text>
    <TransactionHistory {histories} />
</Stack>
