<script lang="ts" context="module">
    export const DEFAULT_QUEEN_MESSAGE = 'Loading ...';
    export const HEADER_HEIGHT = '45px';
</script>

<script lang="ts">
    import { goto } from '$app/navigation';
    import { chainRepository } from '$lib/blockchain/chain.repository';
    import { mnemonicToPrivateKey } from '$lib/blockchain/utils';
    import User from '$lib/power/user';
    import WalletLinker from '$lib/power/WalletLinker.svelte';
    import { Alert, Modal, Stack } from '@svelteuidev/core';
    import TopBar from '$lib/home/TopBar.svelte';
    import { currentPower } from '$lib/power/power';

    $: currentUser = $currentPower instanceof User ? $currentPower : undefined;
    $: isMod = $currentPower.roleView.isUserMod(currentUser?.walletServices.address ?? '');
    $: isQueen = $currentPower.roleView.isUserQueen(currentUser?.walletServices.address ?? '');
    $: queen = $currentPower.roleView.currentQueen();

    let connectWalletOpened = false;
    function closeConnectWallet() {
        connectWalletOpened = false;
    }
    function openConnectWallet() {
        connectWalletOpened = true;
    }
    let connectWalletError = '';
    function connectWallet(loginType: 'Private Key' | 'Mnemonic', keyOrSeed: string) {
        if (loginType === 'Private Key') {
            currentPower.signIn(keyOrSeed);
            closeConnectWallet();
            connectWalletError = '';
        } else {
            const key = mnemonicToPrivateKey(keyOrSeed);
            if (key == undefined) {
                connectWalletError =
                    'Somehow you managed to submit an invalid private key or seed phrase.';
            } else {
                currentPower.signIn(key);
                closeConnectWallet();
                connectWalletError = '';
            }
        }
    }

    function logout() {
        currentPower.signOut();
    }

    function routeToHome() {
        goto('/');
    }

    function routeToWallet() {
        goto('/wallet');
    }

    function routeToAbdicate() {
        goto('/governance/queen/abdicate');
    }

    function routeToModChange() {
        goto('/governance/mod/change-mod');
    }

    function routeToThresholdUpdate() {
        goto('/governance/mod/update-threshold');
    }
</script>

<TopBar
    chainName={$chainRepository.name}
    chainId={$chainRepository.chainId}
    queen={$queen ?? DEFAULT_QUEEN_MESSAGE}
    isQueen={$isQueen}
    isMod={$isMod}
    showConnectWallet={!($currentPower instanceof User)}
    onConnectWallet={openConnectWallet}
    onNavigateAbdicate={routeToAbdicate}
    onNavigateModChange={routeToModChange}
    onNavigateThresholdUpdate={routeToThresholdUpdate}
    onNavigateHome={routeToHome}
    onNavigateWallet={routeToWallet}
    onLogout={logout}
/>

<Modal opened={connectWalletOpened} on:close={closeConnectWallet} title="Connect your wallet!">
    <Stack>
        <WalletLinker onConfirm={connectWallet} />
        {#if connectWalletError !== ''}
            <Alert title="Invalid Private Key!">
                {connectWalletError}
            </Alert>
        {/if}
    </Stack>
</Modal>
