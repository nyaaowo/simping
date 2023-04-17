<script lang="ts">
    import { goto } from '$app/navigation';
    import type { Address } from '$lib/blockchain/address';
    import { transactionQueue } from '$lib/blockchain/transaction/transaction-queue';
    import { defaultNotificationQueue } from '$lib/notification/default-notification-queue';
    import User from '$lib/power/user';
    import { currentPower } from '$lib/power/power';
    import QueenAbdicate from './QueenAbdicate.svelte';

    $: currentUser = $currentPower instanceof User ? $currentPower : undefined;
    $: isQueen = $currentPower.roleView.isUserQueen(currentUser?.walletServices.address ?? '');
    $: if ($transactionQueue?.completed) {
        goto(`/`);
        transactionQueue.clear();
    }
    function handleAbdicate(newQueen: Address) {
        if (currentUser != undefined && isQueen) {
            currentUser.transactionServices.abdicate(newQueen, () => {
                $currentPower.roleView.refreshCache();
            });
        } else if (currentUser != undefined && !isQueen) {
            defaultNotificationQueue.send({
                title: 'User not authorized',
                message: 'Only queen can abdicate',
                notificationType: 'Failure'
            });
        } else if (currentUser == undefined) {
            defaultNotificationQueue.send({
                title: 'Wallet not connected',
                message: 'Please connect your wallet to abdicate',
                notificationType: 'Failure'
            });
        }
    }
</script>

<QueenAbdicate onAbdicate={handleAbdicate} />
