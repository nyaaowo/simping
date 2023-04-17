<script lang="ts">
    import DefaultTopBar, { HEADER_HEIGHT } from '$lib/home/DefaultTopBar.svelte';
    import DefaultWalletOverview from '$lib/wallet/DefaultWalletOverview.svelte';
    import { AppShell, Header } from '@svelteuidev/core';
</script>

<AppShell>
    <Header height={HEADER_HEIGHT} slot="header">
        <DefaultTopBar />
    </Header>

    <slot>
        <DefaultWalletOverview />
    </slot>
</AppShell>
