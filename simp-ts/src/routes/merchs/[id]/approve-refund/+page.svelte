<script lang="ts">
    import DefaultTopBar, { HEADER_HEIGHT } from '$lib/home/DefaultTopBar.svelte';
    import DefaultMerchRefundApproval from '$lib/merch/DefaultMerchRefundApproval.svelte';
    import { AppShell, Header } from '@svelteuidev/core';

    export let data;
    $: id = data.props.id;
</script>

<AppShell>
    <Header height={HEADER_HEIGHT} slot="header">
        <DefaultTopBar />
    </Header>

    <slot>
        <DefaultMerchRefundApproval {id} />
    </slot>
</AppShell>
