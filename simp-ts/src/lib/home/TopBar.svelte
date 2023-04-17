<script lang="ts">
    import { Button, Group, ActionIcon } from '@svelteuidev/core';
    import type { Address } from '$lib/blockchain/address';
    import Chain from '$lib/blockchain/Chain.svelte';
    import Queen from '$lib/power/Queen.svelte';
    import TopBarMenu from '$lib/home/TopBarMenu.svelte';
    import HomeIcon from '$lib/assets/HomeIcon.svelte';

    export let chainName: string;
    export let chainId: number;
    export let queen: Address;
    export let showConnectWallet: boolean;
    export let isQueen: boolean;
    export let isMod: boolean;
    export let onConnectWallet: () => void;
    export let onNavigateWallet: () => void;
    export let onNavigateHome: () => void;
    export let onNavigateAbdicate: () => void;
    export let onNavigateModChange: () => void;
    export let onNavigateThresholdUpdate: () => void;
    export let onLogout: () => void;

    let showCopied = false;

    function copyQueenAddress() {
        navigator.clipboard.writeText(queen);
        showCopied = true;
        setTimeout(() => {
            showCopied = false;
        }, 1000);
    }
</script>

<Group position="apart" noWrap>
    <Group noWrap>
        <ActionIcon size="lg" on:click={onNavigateHome}>
            <HomeIcon size={48} />
        </ActionIcon>

        <slot name="chain">
            <Chain id={chainId} name={chainName} />
        </slot>
        <slot name="queen">
            <Queen address={showCopied ? 'Copied' : queen} onClick={copyQueenAddress} />
        </slot>
    </Group>

    <Group position="right" noWrap>
        {#if showConnectWallet}
            <Button
                variant="gradient"
                on:click={onConnectWallet}
                gradient={{ from: 'grape', to: 'pink', deg: 35 }}
                radius="md"
                ripple
            >
                Connect Wallet
            </Button>
        {:else}
            <Button
                variant="gradient"
                on:click={onNavigateWallet}
                gradient={{ from: 'teal', to: 'blue', deg: 60 }}
                radius="md"
                ripple
            >
                Wallet
            </Button>
        {/if}
        <TopBarMenu
            showLogout={!showConnectWallet}
            showMod={isMod}
            showQueen={isQueen}
            onAbdicate={onNavigateAbdicate}
            onModChange={onNavigateModChange}
            onUpdateModThreshold={onNavigateThresholdUpdate}
            {onLogout}
        />
    </Group>
</Group>
