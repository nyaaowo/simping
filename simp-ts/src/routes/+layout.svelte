<script lang="ts">
    import DefaultConfirmation from '$lib/blockchain/confirmation/DefaultConfirmation.svelte';
    import DefaultNotificationQueue from '$lib/notification/DefaultNotificationQueue.svelte';
    import { currentPower } from '$lib/power/power';
    import { SvelteUIProvider } from '@svelteuidev/core';
    import { onMount } from 'svelte';

    // need to subscribe here so the first subscribe function doesn't run every time
    $currentPower;

    let theme: 'dark' | 'light' = 'light';

    onMount(() => {
        window.matchMedia('(prefers-color-scheme: dark)').addEventListener('change', (event) => {
            theme = event.matches ? 'dark' : 'light';
        });
    });
</script>

<SvelteUIProvider themeObserver={theme}>
    <slot />
    <DefaultConfirmation />
    <DefaultNotificationQueue />
</SvelteUIProvider>
