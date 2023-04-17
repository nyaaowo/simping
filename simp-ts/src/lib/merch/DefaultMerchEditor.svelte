<script lang="ts">
    import { goto } from '$app/navigation';
    import { transactionQueue } from '$lib/blockchain/transaction/transaction-queue';
    import { defaultNotificationQueue } from '$lib/notification/default-notification-queue';
    import User from '$lib/power/user';
    import { Loader } from '@svelteuidev/core';
    import type Big from 'big.js';
    import { get } from 'svelte/store';
    import MerchEditor from './MerchEditor.svelte';
    import { currentPower } from '$lib/power/power';

    export let id: number;
    $: merch = $currentPower.merchView.merch(id);
    $: original = merch.then((value) => {
        return {
            id: id,
            name: value.name,
            imageSrc: value.imageSrc,
            target: value.targetAmount,
            expiry: value.expiry
        };
    });

    $: if ($transactionQueue?.completed) {
        goto(`/`);
        transactionQueue.clear();
    }

    function handleEditMerch(id: number, name: string, imageSrc: URL, target: Big, expiry: Date) {
        const user = get(currentPower);
        if (
            user instanceof User &&
            get(user.roleView.isUserQueenOrMod(user.walletServices.address))
        ) {
            user.transactionServices.updateMerch(
                id,
                name,
                imageSrc.toString(),
                target,
                expiry,
                () => {
                    $currentPower.merchView.refreshCache();
                }
            );
        } else if (
            user instanceof User &&
            !get(user.roleView.isUserQueenOrMod(user.walletServices.address))
        ) {
            defaultNotificationQueue.send({
                title: 'User not authorized',
                message: 'Only queen or mod can edit target',
                notificationType: 'Failure'
            });
        } else if (!(user instanceof User)) {
            defaultNotificationQueue.send({
                title: 'Wallet not connected',
                message: 'Please connect your wallet to edit target',
                notificationType: 'Failure'
            });
        }
    }
</script>

{#await original}
    <Loader />
{:then originalData}
    <MerchEditor original={originalData} onUpdate={handleEditMerch} />
{/await}
