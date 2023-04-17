<script lang="ts">
    import DefaultTopBar, { HEADER_HEIGHT } from '$lib/home/DefaultTopBar.svelte';
    import DefaultMerchDonate from '$lib/merch/DefaultMerchDonate.svelte';
    import { AppShell, Header } from '@svelteuidev/core';

    export let data;
    $: id = data.props.id;
</script>

<AppShell>
    <Header height={HEADER_HEIGHT} slot="header">
        <DefaultTopBar />
    </Header>

    <slot>
        <DefaultMerchDonate {id} />
    </slot>
</AppShell>
