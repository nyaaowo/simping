<script lang="ts">
    import User from '$lib/power/user';
    import Big from 'big.js';
    import { onMount } from 'svelte';
    import WalletOverview from './WalletOverview.svelte';
    import { currentPower } from '$lib/power/power';

    $: currentUser = $currentPower instanceof User ? $currentPower : undefined;
    $: userAddress = currentUser?.walletServices.address ?? '';
    let userBalance = Big(0);
    $: {
        if (currentUser != undefined) {
            currentUser.walletServices.balance().then((result) => {
                userBalance = result;
            });
        } else {
            userBalance = Big(0);
        }
    }

    let histories: Promise<
        {
            hash: string;
            status: 'Success' | 'Pending' | 'Failure';
            title: string;
            amount: Big;
            date: Date;
        }[]
    > = Promise.resolve([]);
    $: fetchedTransactions = currentUser?.transactionServices.transactionHistory();
    $: {
        if ($fetchedTransactions != undefined) {
            histories = Promise.resolve(
                $fetchedTransactions.map((value) => {
                    return {
                        hash: value.hash,
                        status: value.status,
                        title: value.name,
                        amount: value.amount,
                        date: value.date
                    };
                })
            );
        } else {
            histories = Promise.reject('User not logged in');
        }
    }

    onMount(() => {
        currentUser?.transactionServices.waiter.waitForAllPending();
    });
</script>

<WalletOverview account={userAddress} balance={userBalance} {histories} />
