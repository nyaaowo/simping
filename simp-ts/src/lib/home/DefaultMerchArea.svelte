<script lang="ts">
    import { goto } from '$app/navigation';
    import PlusIcon from '$lib/assets/PlusIcon.svelte';
    import type { Address } from '$lib/blockchain/address';
    import { merchStatus } from '$lib/merch/merch';
    import MerchList from '$lib/merch/MerchList.svelte';
    import User from '$lib/power/user';
    import { ActionIcon, Stack } from '@svelteuidev/core';
    import { readable } from 'svelte/store';
    import { currentPower } from '$lib/power/power';

    $: currentMerchs = $currentPower.merchView.allCurrentMerchs(undefined, 'Default');
    $: merchs = $currentMerchs.map((merch) => {
        return {
            id: merch.id,
            name: merch.name,
            imageSrc: merch.imageSrc,
            current: merch.currentAmount,
            target: merch.targetAmount,
            expiry: merch.expiry,
            status: merchStatus(merch)
        };
    });
    $: currentAddress =
        $currentPower instanceof User ? $currentPower.walletServices.address : undefined;
    $: isMod =
        currentAddress != undefined
            ? $currentPower.roleView.isUserMod(currentAddress)
            : readable(false);
    $: isQueen =
        currentAddress != undefined
            ? $currentPower.roleView.isUserQueen(currentAddress)
            : readable(false);
    $: showAddMerch = $isMod || $isQueen;
    $: refundableAmount = (id: number, donor: Address) => {
        return $currentPower.merchView.currentDonatedAmount(id, donor);
    };

    function routeToAddMerch() {
        goto(`/merchs/new`);
    }

    function routeToMerchInfo(id: number) {
        const merch = merchs.find((value) => {
            return value.id === id;
        });
        if (merch != undefined && merch.status != 'Completed') {
            goto(`/merchs/${id}`);
        }
    }
</script>

<Stack align="flex-start">
    {#if showAddMerch}
        <ActionIcon on:click={routeToAddMerch}>
            <PlusIcon />
        </ActionIcon>
    {/if}

    <MerchList {currentAddress} {refundableAmount} onSelect={routeToMerchInfo} {merchs} />
</Stack>
