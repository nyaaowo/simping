<script lang="ts">
    import { goto } from '$app/navigation';
    import { transactionQueue } from '$lib/blockchain/transaction/transaction-queue';
    import { defaultNotificationQueue } from '$lib/notification/default-notification-queue';
    import User from '$lib/power/user';
    import type Big from 'big.js';
    import { get } from 'svelte/store';
    import MerchCreator from './MerchCreator.svelte';
    import { currentPower } from '$lib/power/power';

    $: if ($transactionQueue?.completed) {
        goto(`/`);
        transactionQueue.clear();
    }

    function handleCreateMerch(name: string, imageSrc: URL, target: Big, expiry: Date) {
        const user = get(currentPower);
        if (
            user instanceof User &&
            get(user.roleView.isUserQueenOrMod(user.walletServices.address))
        ) {
            user.transactionServices.createMerch(name, imageSrc.toString(), target, expiry, () => {
                $currentPower.merchView.refreshCache();
            });
        } else if (
            user instanceof User &&
            !get(user.roleView.isUserQueenOrMod(user.walletServices.address))
        ) {
            defaultNotificationQueue.send({
                title: 'User not authorized',
                message: 'Only queen or mod can create target',
                notificationType: 'Default'
            });
        } else if (!(user instanceof User)) {
            defaultNotificationQueue.send({
                title: 'Wallet not connected',
                message: 'Please connect your wallet to create target',
                notificationType: 'Default'
            });
        }
    }
</script>

<MerchCreator onCreateMerch={handleCreateMerch} />
