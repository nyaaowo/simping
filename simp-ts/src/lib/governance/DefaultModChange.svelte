<script lang="ts">
    import { goto } from '$app/navigation';
    import type { Address } from '$lib/blockchain/address';
    import { transactionQueue } from '$lib/blockchain/transaction/transaction-queue';
    import { defaultNotificationQueue } from '$lib/notification/default-notification-queue';
    import { currentPower } from '$lib/power/power';
    import User from '$lib/power/user';
    import type { Timestamp } from '$lib/utils/timestamp';
    import ModChange from './ModChange.svelte';

    $: currentUser = $currentPower instanceof User ? $currentPower : undefined;
    $: isMod = $currentPower.roleView.isUserMod(currentUser?.walletServices.address ?? '');
    $: sigThreshold = $currentPower.governanceView.currentModThreshold();
    $: if ($transactionQueue?.completed) {
        goto(`/`);
        transactionQueue.clear();
    }

    function handlePromoteOrDemote(
        promoteOrDemote: 'Promote' | 'Demote'
    ): (mod: Address, deadline: Timestamp, signatures: string[]) => void {
        return (mod: Address, deadline: Timestamp, signatures: string[]) => {
            if (currentUser != undefined && isMod) {
                if (promoteOrDemote === 'Promote') {
                    currentUser.transactionServices.promoteMod(mod, deadline, signatures, () => {
                        $currentPower.roleView.refreshCache();
                    });
                } else if (promoteOrDemote === 'Demote') {
                    currentUser.transactionServices.demoteMod(mod, deadline, signatures, () => {
                        $currentPower.roleView.refreshCache();
                    });
                }
            } else if (currentUser != undefined && !isMod) {
                defaultNotificationQueue.send({
                    title: 'User not authorized',
                    message: 'Only mods can promote or demote mod',
                    notificationType: 'Failure'
                });
            } else if (currentUser == undefined) {
                defaultNotificationQueue.send({
                    title: 'Wallet not connected',
                    message: 'Please connect your wallet to authorize mod change',
                    notificationType: 'Failure'
                });
            }
        };
    }

    function handleSigning(
        promoteOrDemote: 'Promote' | 'Demote'
    ): (mod: Address, deadline: Timestamp) => Promise<string> {
        return async (mod: Address, deadline: Timestamp) => {
            if (currentUser != undefined && isMod) {
                if (promoteOrDemote === 'Promote') {
                    return currentUser.transactionServices.signPromoteMod(mod, deadline);
                } else if (promoteOrDemote === 'Demote') {
                    return currentUser.transactionServices.signDemoteMod(mod, deadline);
                }
            } else if (currentUser == undefined) {
                defaultNotificationQueue.send({
                    title: 'Wallet not connected',
                    message: 'Please connect your wallet to sign transaction',
                    notificationType: 'Failure'
                });
            }
            return '';
        };
    }
</script>

<ModChange
    sigThreshold={$sigThreshold}
    onPromote={handlePromoteOrDemote('Promote')}
    onDemote={handlePromoteOrDemote('Demote')}
    onPromoteSign={handleSigning('Promote')}
    onDemoteSign={handleSigning('Demote')}
/>
