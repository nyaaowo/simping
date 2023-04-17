<script lang="ts">
    import { mnemonicToAddress, privateKeyToAddress } from '$lib/blockchain/utils';
    import { Button, InputWrapper, NativeSelect, Stack, Text } from '@svelteuidev/core';
    import { fade } from 'svelte/transition';

    export let loginType: 'Private Key' | 'Mnemonic' = 'Private Key';
    export let privateKey = '';
    export let seedPhrase = '';
    export let onConfirm: (
        type: 'Private Key' | 'Mnemonic',
        privateKeyOrSeedPhrase: string
    ) => void;
    $: walletAddress =
        loginType === 'Private Key'
            ? privateKeyToAddress(privateKey)
            : mnemonicToAddress(seedPhrase);
    $: isDisabled = walletAddress == undefined;

    function handleConfirm() {
        if (loginType === 'Private Key') {
            onConfirm('Private Key', privateKey);
        } else {
            onConfirm('Mnemonic', seedPhrase);
        }
    }
</script>

<Stack>
    <Text>Export your private key or mnemonic from a wallet of your choice and paste it here.</Text>

    <NativeSelect
        data={['Private Key', 'Mnemonic']}
        bind:value={loginType}
        label="Login with private key or mnemonic (seed phrase)"
    />

    {#if loginType === 'Private Key'}
        <InputWrapper label="Private Key" description="Enter your private key here">
            <textarea bind:value={privateKey} />
        </InputWrapper>
    {:else}
        <InputWrapper
            label="Mnemonic (BIP-39)"
            description="Enter your seed phrase here (separated by space)"
        >
            <textarea bind:value={seedPhrase} />
        </InputWrapper>
    {/if}
    {#if walletAddress != undefined}
        <div transition:fade>
            <Text>Derived address is {walletAddress}</Text>
        </div>
    {/if}
    <Button disabled={isDisabled} ripple variant="outline" on:click={handleConfirm}>Confirm</Button>
</Stack>
