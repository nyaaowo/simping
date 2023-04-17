<script lang="ts">
    import DefaultModChange from '$lib/governance/DefaultModChange.svelte';
    import DefaultTopBar, { HEADER_HEIGHT } from '$lib/home/DefaultTopBar.svelte';
    import { AppShell, Header } from '@svelteuidev/core';
</script>

<AppShell>
    <Header height={HEADER_HEIGHT} slot="header">
        <DefaultTopBar />
    </Header>

    <slot>
        <DefaultModChange />
    </slot>
</AppShell>
