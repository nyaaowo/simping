<script lang="ts">
    import { chainRepository } from '$lib/blockchain/chain.repository';
    import Confirmation from '$lib/blockchain/confirmation/Confirmation.svelte';
    import { contractAddressRepository } from '$lib/blockchain/contract-address.repository';
    import { transactionQueue } from '$lib/blockchain/transaction/transaction-queue';
    import { defaultNotificationQueue } from '$lib/notification/default-notification-queue';
    import { debounce } from '$lib/utils/delay';
    import { Modal } from '@svelteuidev/core';
    import Big from 'big.js';
    import { get } from 'svelte/store';

    export let target: string | HTMLElement | undefined = undefined;
    $: opened = $transactionQueue != undefined && !$transactionQueue.completed;

    function handleReject() {
        transactionQueue.clear();
    }

    function handleConfirm() {
        const current = get(transactionQueue);
        if (current != undefined && !current.completed) {
            defaultNotificationQueue.send({
                title: 'Transaction Sent',
                message: 'Waiting for transaction to be accepted on chain',
                notificationType: 'Default'
            });
            current
                .onConfirm()
                .then((receipt) => {
                    defaultNotificationQueue.send({
                        title: 'Transaction Successful',
                        message: `Transaction completed with hash: ${receipt.hash}`,
                        notificationType: 'Success'
                    });
                })
                .catch((error) => {
                    defaultNotificationQueue.send({
                        title: 'Transaction Failed',
                        message: `Error: ${error}`,
                        notificationType: 'Failure'
                    });
                });
        }
        transactionQueue.complete();
    }
</script>

<Modal {target} {opened} withCloseButton={false}>
    <Confirmation
        chainName={$chainRepository.name}
        contractAddress={$contractAddressRepository}
        action={$transactionQueue?.action ?? 'Something is wrong 😭'}
        onReject={handleReject}
        onConfirm={debounce(handleConfirm, 500)}
        amount={$transactionQueue?.amount ?? Big(0)}
        gasFee={$transactionQueue?.gasFee ?? Big(0)}
    />
</Modal>
