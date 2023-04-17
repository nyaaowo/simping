<script lang="ts">
    import DefaultConfirmation from '$lib/blockchain/confirmation/DefaultConfirmation.svelte';
    import DefaultTopBar, { HEADER_HEIGHT } from '$lib/home/DefaultTopBar.svelte';
    import DefaultMerchEditor from '$lib/merch/DefaultMerchEditor.svelte';
    import DefaultNotificationQueue from '$lib/notification/DefaultNotificationQueue.svelte';
    import { AppShell, Header } from '@svelteuidev/core';

    export let data;
    $: id = data.props.id;
</script>

<AppShell>
    <Header height={HEADER_HEIGHT} slot="header">
        <DefaultTopBar />
    </Header>

    <slot>
        <DefaultMerchEditor {id} />
    </slot>
</AppShell>
<DefaultConfirmation />
<DefaultNotificationQueue />
