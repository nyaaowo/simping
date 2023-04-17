<script lang="ts">
    import type { Address } from '$lib/blockchain/address';
    import { Button, Stack, TextInput } from '@svelteuidev/core';
    import { parseAddress } from '../utils/input-transformer';

    export let address = '';
    export let onAbdicate: (newQueen: Address) => void;
    $: fAddress = parseAddress(address);
    $: isDisabled = address === '' || fAddress.error !== '';

    function handleClick() {
        onAbdicate(fAddress.value);
    }
</script>

<Stack align="stretch">
    <TextInput
        label="Address of new queen"
        error={address === '' ? '' : fAddress.error}
        placeholder="New queen"
        bind:value={address}
    />
    <Button variant="outline" ripple disabled={isDisabled} on:click={handleClick}>Abdicate</Button>
</Stack>
