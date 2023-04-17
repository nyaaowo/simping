<script lang="ts">
    import { goto } from '$app/navigation';
    import { transactionQueue } from '$lib/blockchain/transaction/transaction-queue';
    import { defaultNotificationQueue } from '$lib/notification/default-notification-queue';
    import User from '$lib/power/user';
    import { currentPower } from '$lib/power/power';
    import type { Timestamp } from '$lib/utils/timestamp';
    import ThresholdChange from './ThresholdChange.svelte';

    $: currentUser = $currentPower instanceof User ? $currentPower : undefined;
    $: isMod = $currentPower.roleView.isUserMod(currentUser?.walletServices.address ?? '');
    $: sigThreshold = $currentPower.governanceView.currentModThreshold();
    $: if ($transactionQueue?.completed) {
        goto(`/`);
        transactionQueue.clear();
    }

    function handleUpdateModThreshold(
        threshold: number,
        deadline: Timestamp,
        signatures: string[]
    ) {
        if (currentUser != undefined && isMod) {
            currentUser.transactionServices.updateModThreshold(
                threshold,
                deadline,
                signatures,
                () => {
                    $currentPower.governanceView.refreshCache();
                }
            );
        } else if (currentUser != undefined && !isMod) {
            defaultNotificationQueue.send({
                title: 'User not authorized',
                message: 'Only mods can update signature threshold',
                notificationType: 'Failure'
            });
        } else if (currentUser == undefined) {
            defaultNotificationQueue.send({
                title: 'Wallet not connected',
                message: 'Please connect your wallet to authorize threshold update',
                notificationType: 'Failure'
            });
        }
    }

    async function handleSigning(threshold: number, deadline: Timestamp): Promise<string> {
        if (currentUser != undefined && isMod) {
            return currentUser.transactionServices.signUpdateModeThreshold(threshold, deadline);
        } else if (currentUser == undefined) {
            defaultNotificationQueue.send({
                title: 'Wallet not connected',
                message: 'Please connect your wallet to sign transaction',
                notificationType: 'Failure'
            });
        }
        return '';
    }
</script>

<ThresholdChange
    sigThreshold={$sigThreshold}
    onUpdateModThreshold={handleUpdateModThreshold}
    onUpdateModThresholdSign={handleSigning}
/>
