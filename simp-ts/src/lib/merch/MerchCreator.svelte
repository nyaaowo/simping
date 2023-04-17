<script lang="ts">
    import { MERCH_HEIGHT, MERCH_WIDTH } from '$lib/merch/merch-image';
    import { parseAmount, parseDate, parseWhitelistedImageUrl } from '$lib/utils/input-transformer';
    import { Button, Group, Image, Stack, Text, TextInput } from '@svelteuidev/core';
    import type Big from 'big.js';

    export let name = '';
    export let imageSrc = '';
    export let target = '';
    export let expiry = '';
    export let onCreateMerch: (name: string, imageSrc: URL, target: Big, expiry: Date) => void;
    $: fTarget = parseAmount(target);
    $: fExpiry = parseDate(expiry);
    $: whitelistedImage = parseWhitelistedImageUrl(imageSrc);
    $: isDisabled =
        name === '' ||
        whitelistedImage.error !== '' ||
        fTarget.error !== '' ||
        fExpiry.error !== '';

    function handleClick() {
        onCreateMerch(name, new URL(imageSrc), fTarget.value, fExpiry.value);
    }
</script>

<Group grow noWrap>
    <Stack align="stretch">
        <Text weight={'semibold'}>Create new target</Text>
        <TextInput label="Name" placeholder="name" bind:value={name} />
        <TextInput
            label="Image Url"
            placeholder="url"
            type="url"
            bind:value={imageSrc}
            error={imageSrc === '' ? '' : whitelistedImage.error}
        />
        <TextInput
            label="Donation Target"
            placeholder="amount"
            bind:value={target}
            error={target === '' ? '' : fTarget.error}
        />
        <TextInput label="Expiry Date" type="date" bind:value={expiry} error={fExpiry.error} />

        <Button variant="outline" ripple disabled={isDisabled} on:click={handleClick}>Create</Button
        >
    </Stack>
    <Image
        src={whitelistedImage.src}
        height={MERCH_HEIGHT}
        width={MERCH_WIDTH}
        fit="contain"
        usePlaceholder
    >
        <svelte:fragment slot="placeholder">
            {#if whitelistedImage.error !== ''}
                <Text>{whitelistedImage.error}</Text>
            {/if}
        </svelte:fragment>
    </Image>
</Group>
