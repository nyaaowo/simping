<script lang="ts">
    import EditIcon from '$lib/assets/EditIcon.svelte';
    import type { MerchStatus } from '$lib/merch/merch';
    import { MERCH_HEIGHT, MERCH_WIDTH } from '$lib/merch/merch-image';
    import { parseWhitelistedImageUrl } from '$lib/utils/input-transformer';
    import { ActionIcon, Button, Group, Image, Stack, Text } from '@svelteuidev/core';
    import type Big from 'big.js';

    export let id: number;
    export let name: string;
    export let imageSrc: URL | string | undefined;
    export let current: Big;
    export let target: Big;
    export let expiry: Date;
    export let status: MerchStatus;
    export let showApproveRelease: boolean;
    export let showApproveRefund: boolean;
    export let showUpdate: boolean;

    export let onDonate: (id: number) => void;
    export let onRefund: (id: number) => void;
    export let onUpdate: (id: number) => void;
    export let onApproveRelease: (id: number) => void;
    export let onApproveRefund: (id: number) => void;

    $: whitelistedImage = parseWhitelistedImageUrl(imageSrc);

    function handleDonate() {
        onDonate(id);
    }

    function handleRefund() {
        onRefund(id);
    }

    function handleUpdate() {
        onUpdate(id);
    }

    function handleApproveRefund() {
        onApproveRefund(id);
    }

    function handleApproveReleaseFund() {
        onApproveRelease(id);
    }
</script>

<Stack align="flex-start">
    <Group noWrap position="right">
        {#if showUpdate}
            <ActionIcon on:click={handleUpdate}>
                <EditIcon />
            </ActionIcon>
        {/if}
        {#if showApproveRefund}
            <Button variant="outline" radius="xl" size="xs" ripple on:click={handleApproveRefund}>
                Approve Refund
            </Button>
        {/if}
        {#if showApproveRelease}
            <Button
                variant="outline"
                radius="xl"
                size="xs"
                ripple
                on:click={handleApproveReleaseFund}
            >
                Release Fund
            </Button>
        {/if}
    </Group>

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

        <Stack>
            <Text weight="semibold">{name}</Text>
            <Text align="right">
                {current}/{target} <br />
                Expiry: {expiry.toLocaleDateString()}
            </Text>

            {#if status === 'Active'}
                <Button ripple variant="light" on:click={handleDonate}>Donate</Button>
            {:else if status === 'Refundable'}
                <Button ripple variant="light" on:click={handleRefund}>Refund</Button>
            {/if}
        </Stack>
    </Group>
</Stack>
