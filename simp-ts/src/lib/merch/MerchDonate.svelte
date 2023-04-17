<script lang="ts">
    import { MERCH_HEIGHT, MERCH_WIDTH } from '$lib/merch/merch-image';
    import { parseAmount } from '$lib/utils/input-transformer';
    import { Button, Group, Image, Stack, Text, TextInput } from '@svelteuidev/core';
    import type Big from 'big.js';

    export let id: number;
    export let name: string;
    export let imageUrl: string;
    export let amount = '';
    export let onDonate: (merchId: number, amount: Big) => void;
    $: fAmount = parseAmount(amount);
    $: isDisabled = amount === '' || fAmount.error !== '';

    function handleClick() {
        onDonate(id, fAmount.value);
    }
</script>

<Group noWrap>
    <Image src={imageUrl} height={MERCH_HEIGHT} width={MERCH_WIDTH} />
    <Stack align="stretch">
        <Text weight={'semibold'}>{name}</Text>
        <TextInput
            label="Donation"
            error={amount === '' ? '' : fAmount.error}
            placeholder="Donation"
            bind:value={amount}
        />
        <Button variant="outline" ripple disabled={isDisabled} on:click={handleClick}>Donate</Button
        >
    </Stack>
</Group>
