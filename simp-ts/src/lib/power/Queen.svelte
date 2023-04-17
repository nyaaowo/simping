<script lang="ts">
    import CrownIcon from '$lib/assets/CrownIcon.svelte';
    import { Button } from '@svelteuidev/core';

    export let address: string;
    export let onClick: () => void;
</script>

<Button on:click={() => onClick()} variant="outline" radius="xl" size="sm" ripple>
    <CrownIcon slot="leftIcon" />
    {address}
</Button>
