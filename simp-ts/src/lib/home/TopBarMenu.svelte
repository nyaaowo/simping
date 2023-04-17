<script lang="ts">
    import { Menu } from '@svelteuidev/core';

    export let showLogout: boolean;
    export let showMod: boolean;
    export let showQueen: boolean;
    export let onAbdicate: () => void;
    export let onModChange: () => void;
    export let onUpdateModThreshold: () => void;
    export let onLogout: () => void;
</script>

<Menu>
    {#if showQueen}
        <Menu.Label>Queen</Menu.Label>
        <Menu.Item on:click={onAbdicate}>Abdicate</Menu.Item>
    {/if}
    {#if showMod}
        <Menu.Label>Mod</Menu.Label>
        <Menu.Item on:click={onModChange}>Promote/Demote Mod</Menu.Item>
        <Menu.Item on:click={onUpdateModThreshold}>Update threshold</Menu.Item>
    {/if}
    {#if showLogout}
        <Menu.Item color="red" on:click={onLogout}>Logout</Menu.Item>
    {/if}
</Menu>
