<script lang="ts">
    import { defaultNotificationQueue } from '$lib/notification/default-notification-queue';
    import NotificationQueue from '$lib/notification/NotificationQueue.svelte';
    import { Affix } from '@svelteuidev/core';

    $: hasNotification = $defaultNotificationQueue.length !== 0;
</script>

<Affix position={{ bottom: 20, left: 20 }}>
    {#if hasNotification}
        <NotificationQueue notifications={$defaultNotificationQueue} />
    {/if}
</Affix>
