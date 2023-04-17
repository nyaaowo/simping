<script lang="ts">
    import { goto } from '$app/navigation';
    import { transactionQueue } from '$lib/blockchain/transaction/transaction-queue';
    import { defaultNotificationQueue } from '$lib/notification/default-notification-queue';
    import User from '$lib/power/user';
    import { get } from 'svelte/store';
    import MerchRefundApproval from './MerchRefundApproval.svelte';
    import { currentPower } from '$lib/power/power';

    export let id: number;

    $: currentMerch = $currentPower.merchView.currentMerch(id);
    $: merchName = $currentMerch?.name ?? '';
    $: merchImageSrc = $currentMerch?.imageSrc ?? '';
    $: if ($transactionQueue?.completed) {
        goto(`/`);
        transactionQueue.clear();
    }

    function handleApprove(id: number) {
        const user = get(currentPower);
        if (user instanceof User && get(user.roleView.isUserMod(user.walletServices.address))) {
            user.transactionServices.approveRefund(id, () => {
                $currentPower.merchView.refreshCache();
            });
        } else if (
            user instanceof User &&
            !get(user.roleView.isUserMod(user.walletServices.address))
        ) {
            defaultNotificationQueue.send({
                title: 'User not authorized',
                message: 'Only mod can approve refund',
                notificationType: 'Failure'
            });
        } else if (!(user instanceof User)) {
            defaultNotificationQueue.send({
                title: 'Wallet not connected',
                message: 'Please connect your wallet to approve refund',
                notificationType: 'Failure'
            });
        }
    }
</script>

<MerchRefundApproval {id} name={merchName} imageSrc={merchImageSrc} onApprove={handleApprove} />
