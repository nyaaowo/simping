<script lang="ts">
    import DefaultThresholdChange from '$lib/governance/DefaultThresholdChange.svelte';
    import DefaultTopBar, { HEADER_HEIGHT } from '$lib/home/DefaultTopBar.svelte';
    import { AppShell, Header } from '@svelteuidev/core';
</script>

<AppShell>
    <Header height={HEADER_HEIGHT} slot="header">
        <DefaultTopBar />
    </Header>

    <slot>
        <DefaultThresholdChange />
    </slot>
</AppShell>
