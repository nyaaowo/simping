<script lang="ts">
    import DefaultQueenAbdicate from '$lib/governance/DefaultQueenAbdicate.svelte';
    import DefaultTopBar, { HEADER_HEIGHT } from '$lib/home/DefaultTopBar.svelte';
    import { AppShell, Header } from '@svelteuidev/core';
</script>

<AppShell>
    <Header height={HEADER_HEIGHT} slot="header">
        <DefaultTopBar />
    </Header>

    <slot>
        <DefaultQueenAbdicate />
    </slot>
</AppShell>
