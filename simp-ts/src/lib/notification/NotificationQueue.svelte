<script lang="ts">
    import CheckboxIcon from '$lib/assets/CheckboxIcon.svelte';
    import XMarkIcon from '$lib/assets/XMarkIcon.svelte';
    import type { KeyedSimpleNotification, NotificationType } from '$lib/notification/notification';
    import { Notification, Stack } from '@svelteuidev/core';
    import type { SvelteComponent } from 'svelte';
    import { fly } from 'svelte/transition';

    export let notifications: KeyedSimpleNotification[];
    function icon(notificationType: NotificationType): typeof SvelteComponent | undefined {
        if (notificationType === 'Default') {
            return undefined;
        } else if (notificationType === 'Success') {
            return CheckboxIcon;
        } else {
            return XMarkIcon;
        }
    }
</script>

<Stack align="flex-start" justify="flex-end">
    {#each notifications as notification (notification.id)}
        <div transition:fly={{ x: -100, duration: 2000 }}>
            <Notification
                title={notification.title}
                icon={icon(notification.notificationType)}
                withCloseButton={false}
            >
                {notification.message}
            </Notification>
        </div>
    {/each}
</Stack>
