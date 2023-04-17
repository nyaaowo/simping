<script lang="ts">
    import { Button, Stack, TextInput } from '@svelteuidev/core';
    import type Big from 'big.js';
    import { parseAmount } from '../utils/input-transformer';

    export let message = '';
    export let amount = '';
    export let donate: (amount: Big, message: string) => void;
    $: fAmount = parseAmount(amount);
    $: isDisabled = message === '' || amount === '' || fAmount.error !== '';

    function handleClick() {
        donate(fAmount.value, message);
    }
</script>

<Stack align="stretch">
    <TextInput label="Message to show everyone" placeholder="Message" bind:value={message} />
    <TextInput
        label="Donation"
        error={amount === '' ? '' : fAmount.error}
        placeholder="Amount"
        bind:value={amount}
    />
    <Button variant="outline" ripple disabled={isDisabled} on:click={handleClick}>Donate</Button>
</Stack>
