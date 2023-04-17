<script lang="ts">
    import { validateExpiry } from '$lib/merch/merch';
    import { MERCH_HEIGHT, MERCH_WIDTH } from '$lib/merch/merch-image';
    import { parseAmount, parseDate, parseWhitelistedImageUrl } from '$lib/utils/input-transformer';
    import { Button, Group, Image, Stack, Text, TextInput } from '@svelteuidev/core';
    import type Big from 'big.js';
    import { onMount } from 'svelte';

    export let original: {
        id: number;
        name: string;
        imageSrc: URL | string | undefined;
        target: Big;
        expiry: Date;
    };

    export let onUpdate: (
        id: number,
        name: string,
        imageSrc: URL,
        target: Big,
        expiry: Date
    ) => void;
    export let name = '';
    export let imageSrc = '';
    export let target = '';
    export let expiry = '';

    $: whitelistedImage = parseWhitelistedImageUrl(imageSrc);
    $: fTarget = parseAmount(target);
    let fExpiry: { value: Date; error: string };
    $: {
        fExpiry = parseDate(expiry);
        if (fExpiry.error === '') {
            const error = validateExpiry(fExpiry.value, original);
            fExpiry.error = error instanceof Error ? error.message : '';
        }
    }
    $: isDisabled =
        name === '' ||
        whitelistedImage.error !== '' ||
        fTarget.error !== '' ||
        fExpiry.error !== '';

    function handleClick() {
        onUpdate(original.id, name, new URL(imageSrc), fTarget.value, fExpiry.value);
    }

    onMount(() => {
        name = original.name;
        imageSrc = original.imageSrc?.toString() ?? '';
        target = original.target.toString();
        expiry = new Date(original.expiry.getTime() - original.expiry.getTimezoneOffset() * 60000)
            .toISOString()
            .slice(0, -1);
    });
</script>

<Group grow noWrap>
    <Stack align="stretch">
        <Text weight={'semibold'}>Edit existing target</Text>
        <TextInput label="Name" placeholder={original.name} bind:value={name} />
        <TextInput
            label="Image Url"
            placeholder={original.imageSrc?.toString()}
            bind:value={imageSrc}
            error={whitelistedImage.error}
        />
        <TextInput
            label="Donation Target"
            placeholder={original.target.toString()}
            bind:value={target}
            error={fTarget.error}
        />
        <TextInput
            label="Expiry Date"
            type="datetime-local"
            bind:value={expiry}
            error={fExpiry.error}
        />

        <Button variant="outline" ripple disabled={isDisabled} on:click={handleClick}>Update</Button
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
