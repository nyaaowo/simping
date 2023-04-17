<script lang="ts">
    import { MERCH_HEIGHT, MERCH_WIDTH } from '$lib/merch/merch-image';
    import { parseWhitelistedImageUrl } from '$lib/utils/input-transformer';
    import { Button, Group, Image, Stack, Text, TextInput } from '@svelteuidev/core';
    import type Big from 'big.js';

    export let id: number;
    export let name: string;
    export let imageSrc: URL | string | undefined;
    export let amount: Big;
    export let retypeCheck = '';
    export let onApprove: (id: number) => void;

    $: whitelistedImage = parseWhitelistedImageUrl(imageSrc);
    $: isDisabled = retypeCheck !== name;

    function handleClick() {
        onApprove(id);
    }
</script>

<Group noWrap>
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

    <Stack align="stretch">
        <Text weight={'semibold'}>Approve Release Fund</Text>
        <Text>
            {name}
        </Text>
        <Text>
            Amount: {amount}
        </Text>
        <TextInput label="Please type {name} to approve." bind:value={retypeCheck} />

        <Button variant="outline" ripple disabled={isDisabled} on:click={handleClick}
            >Approve</Button
        >
    </Stack>
</Group>
