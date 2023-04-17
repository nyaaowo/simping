<script lang="ts">
    import { defaultNotificationQueue } from '$lib/notification/default-notification-queue';
    import User from '$lib/power/user';
    import Big from 'big.js';
    import { get } from 'svelte/store';
    import MerchReleaseApproval from './MerchReleaseApproval.svelte';
    import { goto } from '$app/navigation';
    import { transactionQueue } from '$lib/blockchain/transaction/transaction-queue';
    import { currentPower } from '$lib/power/power';

    export let id: number;

    $: currentMerch = $currentPower.merchView.currentMerch(id);
    $: merchName = $currentMerch?.name ?? '';
    $: merchImageSrc = $currentMerch?.imageSrc ?? '';
    $: merchAmount = $currentMerch?.currentAmount ?? Big(0);
    $: if ($transactionQueue?.completed) {
        goto(`/`);
        transactionQueue.clear();
    }

    function handleApprove(id: number) {
        const user = get(currentPower);
        if (user instanceof User && get(user.roleView.isUserMod(user.walletServices.address))) {
            user.transactionServices.releaseFund(id, () => {
                $currentPower.merchView.refreshCache();
            });
        } else if (
            user instanceof User &&
            !get(user.roleView.isUserMod(user.walletServices.address))
        ) {
            defaultNotificationQueue.send({
                title: 'User not authorized',
                message: 'Only mod can release fund',
                notificationType: 'Failure'
            });
        } else if (!(user instanceof User)) {
            defaultNotificationQueue.send({
                title: 'Wallet not connected',
                message: 'Please connect your wallet to release fund',
                notificationType: 'Failure'
            });
        }
    }
</script>

<MerchReleaseApproval
    {id}
    name={merchName}
    imageSrc={merchImageSrc}
    amount={merchAmount}
    onApprove={handleApprove}
/>
