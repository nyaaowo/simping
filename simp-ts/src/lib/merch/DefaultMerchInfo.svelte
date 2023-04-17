<script lang="ts">
    import { goto } from '$app/navigation';
    import MerchInfo from '$lib/merch/MerchInfo.svelte';
    import User from '$lib/power/user';
    import Big from 'big.js';
    import { get, readable } from 'svelte/store';
    import { merchStatus } from './merch';
    import { defaultNotificationQueue } from '$lib/notification/default-notification-queue';
    import { transactionQueue } from '$lib/blockchain/transaction/transaction-queue';
    import { currentPower } from '$lib/power/power';

    export let id: number;

    $: currentMerch = $currentPower.merchView.currentMerch(id);
    $: merchName = $currentMerch?.name ?? '';
    $: merchImageSrc = $currentMerch?.imageSrc;
    $: merchAmount = $currentMerch?.currentAmount ?? Big(0);
    $: merchTarget = $currentMerch?.targetAmount ?? Big(0);
    $: merchExpiry = $currentMerch?.expiry ?? new Date(Date.UTC(0, 0));
    $: status = $currentMerch != undefined ? merchStatus($currentMerch) : 'Active';
    $: isActive = $currentMerch != undefined && merchStatus($currentMerch) === 'Active';
    $: if ($transactionQueue?.completed) {
        goto(`/`);
        transactionQueue.clear();
    }

    $: isCurrentUserMod =
        $currentPower instanceof User
            ? $currentPower.roleView.isUserMod($currentPower.walletServices.address)
            : readable(false);
    $: isCurrentUserQueenOrMod =
        $currentPower instanceof User
            ? $currentPower.roleView.isUserQueenOrMod($currentPower.walletServices.address)
            : readable(false);
    $: showApproveRelease = $isCurrentUserMod && isActive;
    $: showApproveRefund = $isCurrentUserMod && isActive;
    $: showUpdate = $isCurrentUserQueenOrMod && isActive;

    function handleDonate(id: number) {
        goto(`/merchs/${id}/donate`);
    }

    function handleRefund(id: number) {
        const user = get(currentPower);
        if (user instanceof User) {
            user.transactionServices.refund(id, user.walletServices.address, () => {
                $currentPower.merchView.refreshCache();
            });
        } else if (!(user instanceof User)) {
            defaultNotificationQueue.send({
                title: 'Wallet not connected',
                message: 'Please connect your wallet to refund',
                notificationType: 'Failure'
            });
        }
    }

    function handleApproveRefund(id: number) {
        goto(`/merchs/${id}/approve-refund`);
    }

    function handleApproveReleaseFund(id: number) {
        goto(`/merchs/${id}/approve-release-fund`);
    }

    function handleUpdate(id: number) {
        goto(`/merchs/${id}/edit`);
    }
</script>

<MerchInfo
    {id}
    name={merchName}
    imageSrc={merchImageSrc}
    current={merchAmount}
    target={merchTarget}
    expiry={merchExpiry}
    {status}
    {showApproveRefund}
    {showApproveRelease}
    {showUpdate}
    onRefund={handleRefund}
    onDonate={handleDonate}
    onUpdate={handleUpdate}
    onApproveRefund={handleApproveRefund}
    onApproveRelease={handleApproveReleaseFund}
/>
