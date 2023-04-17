<script lang="ts">
    import { goto } from '$app/navigation';
    import { transactionQueue } from '$lib/blockchain/transaction/transaction-queue';
    import TextDonate from '$lib/leaderboard/TextDonate.svelte';
    import { defaultNotificationQueue } from '$lib/notification/default-notification-queue';
    import User from '$lib/power/user';
    import type Big from 'big.js';
    import { get } from 'svelte/store';
    import { currentPower } from '$lib/power/power';

    $: if ($transactionQueue?.completed) {
        goto(`/`);
        transactionQueue.clear();
    }

    function handleDonate(amount: Big, message: string) {
        const user = get(currentPower);
        if (user instanceof User) {
            user.transactionServices.donateTts(message, amount, () => {
                $currentPower.textDonationView.refreshCache();
            });
        } else {
            defaultNotificationQueue.send({
                title: 'Wallet not connected',
                message: 'Please connect your wallet to donate',
                notificationType: 'Failure'
            });
        }
    }
</script>

<TextDonate donate={handleDonate} />
