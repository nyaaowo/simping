<script lang="ts">
    import BlockIcon from '$lib/assets/BlockIcon.svelte';
    import { Button, Text } from '@svelteuidev/core';

    export let id: number;
    export let name: string;
</script>

<Button variant="outline" radius="xl" size="sm">
    <BlockIcon slot="leftIcon" />
    {name}
    <Text slot="rightIcon">{id}</Text>
</Button>
