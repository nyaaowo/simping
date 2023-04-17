<script lang="ts">
    import { MERCH_HEIGHT, MERCH_WIDTH } from '$lib/merch/merch-image';
    import { parseWhitelistedImageUrl } from '$lib/utils/input-transformer';
    import { Button, Group, Image, Stack, Text } from '@svelteuidev/core';
    import type Big from 'big.js';

    export let id: number;
    export let name: string;
    export let imageSrc: URL;
    export let amount: Big;
    export let expiry: Date;
    export let onRefund: (id: number) => void;

    $: whitelistedImage = parseWhitelistedImageUrl(imageSrc);

    function handleClick() {
        onRefund(id);
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
        <Text weight={'semibold'}>Proceed with your refund</Text>
        <Text>
            {name}
        </Text>
        <Text>
            {amount}
        </Text>
        <Text>
            Expired on: {expiry.toString()}
        </Text>

        <Button variant="outline" ripple on:click={handleClick}>Refund</Button>
    </Stack>
</Group>
