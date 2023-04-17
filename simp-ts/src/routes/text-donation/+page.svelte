<script lang="ts">
    import DefaultTopBar, { HEADER_HEIGHT } from '$lib/home/DefaultTopBar.svelte';
    import DefaultTextDonate from '$lib/leaderboard/DefaultTextDonate.svelte';
    import { AppShell, Header } from '@svelteuidev/core';
</script>

<AppShell>
    <Header height={HEADER_HEIGHT} slot="header">
        <DefaultTopBar />
    </Header>

    <slot>
        <DefaultTextDonate />
    </slot>
</AppShell>
