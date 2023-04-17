<script lang="ts">
    import type { Address } from '$lib/blockchain/address';
    import type { MerchStatus } from '$lib/merch/merch';
    import { MERCH_HEIGHT, MERCH_WIDTH } from '$lib/merch/merch-image';
    import { parseWhitelistedImageUrl } from '$lib/utils/input-transformer';
    import { toDefaultFormat } from '$lib/utils/number';
    import { Box, Card, Image, Overlay, Stack, Text, UnstyledButton } from '@svelteuidev/core';
    import Big from 'big.js';
    import { readable, type Readable } from 'svelte/store';

    export let id: number;
    export let name: string;
    export let imageSrc: URL | string | undefined;
    export let current: Big;
    export let target: Big;
    export let expiry: Date;
    export let status: MerchStatus;

    export let currentAddress: Address | undefined;
    export let refundableAmount: (id: number, donor: Address) => Readable<Big>;
    export let onSelect: (id: number) => void;
    export let disabled = false;

    $: whitelistedImage = parseWhitelistedImageUrl(imageSrc);
    $: userRefundAmount =
        currentAddress != undefined ? refundableAmount(id, currentAddress) : readable(Big(0));
    $: showRefund = $userRefundAmount.gt(Big(0));

    let actionVisible = false;

    function showAction() {
        actionVisible = true;
    }

    function hideAction() {
        actionVisible = false;
    }

    function handleClick() {
        onSelect(id);
    }
</script>

<UnstyledButton
    on:click={handleClick}
    {disabled}
    on:mouseenter={showAction}
    on:mouseleave={hideAction}
>
    <Card shadow="sm" padding="lg">
        <Box>
            {#if actionVisible && !disabled}
                <Overlay opacity={0.1} color="aquamarine" />
            {/if}
            <Card.Section padding="lg">
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
            </Card.Section>

            <Stack>
                <Text weight="semibold">{name}</Text>
                <Text align="right">
                    {toDefaultFormat(current)}/{toDefaultFormat(target)} <br />
                    Expiry: {expiry.toLocaleDateString()}
                </Text>
                <Text align="center">
                    {#if status === 'Active'}
                        Donate
                    {:else if status === 'Refundable' && showRefund}
                        Refund ✔️
                    {:else if status === 'Refundable' && !showRefund}
                        Refund
                    {:else}
                        Expired
                    {/if}
                </Text>
            </Stack>
        </Box>
    </Card>
</UnstyledButton>
