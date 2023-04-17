<script lang="ts">
    import DefaultLeaderboard from '$lib/home/DefaultLeaderboard.svelte';
    import DefaultMerchArea from '$lib/home/DefaultMerchArea.svelte';
    import DefaultTopBar, { HEADER_HEIGHT } from '$lib/home/DefaultTopBar.svelte';
    import DefaultNotificationQueue from '$lib/notification/DefaultNotificationQueue.svelte';
    import { AppShell, Aside, Header } from '@svelteuidev/core';

    const asideWidths = {
        sm: 300,
        lg: 400,
        base: 100
    };
</script>

<AppShell>
    <Header height={HEADER_HEIGHT} slot="header">
        <DefaultTopBar />
    </Header>

    <slot>
        <DefaultMerchArea />
    </slot>

    <Aside slot="aside" width={asideWidths}>
        <DefaultLeaderboard />
    </Aside>
</AppShell>

<DefaultNotificationQueue />
