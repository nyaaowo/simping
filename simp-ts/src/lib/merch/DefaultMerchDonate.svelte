<script lang="ts">
    import { defaultNotificationQueue } from '$lib/notification/default-notification-queue';
    import User from '$lib/power/user';
    import type Big from 'big.js';
    import { get } from 'svelte/store';
    import MerchDonate from './MerchDonate.svelte';
    import { transactionQueue } from '$lib/blockchain/transaction/transaction-queue';
    import { goto } from '$app/navigation';
    import { currentPower } from '$lib/power/power';

    export let id: number;
    $: currentMerch = $currentPower.merchView.currentMerch(id);
    $: merchName = $currentMerch?.name ?? '';
    $: merchImageSrc = $currentMerch?.imageSrc ?? '';
    $: if ($transactionQueue?.completed) {
        goto(`/merchs/${id}`);
        transactionQueue.clear();
    }

    function handleDonate(merchId: number, amount: Big) {
        const user = get(currentPower);
        if (user instanceof User) {
            user.transactionServices.donate(merchId, amount, () => {
                $currentPower.merchView.refreshCache();
            });
        } else if (!(user instanceof User)) {
            defaultNotificationQueue.send({
                title: 'Wallet not connected',
                message: 'Please connect your wallet to donate',
                notificationType: 'Failure'
            });
        }
    }
</script>

<MerchDonate {id} name={merchName} imageUrl={merchImageSrc} onDonate={handleDonate} />
