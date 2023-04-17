<script lang="ts">
    import { toDefaultFormat } from '$lib/utils/number';
    import { Badge, Group, Loader, Stack, Text } from '@svelteuidev/core';
    import type Big from 'big.js';

    export let histories: Promise<
        {
            hash: string;
            status: 'Success' | 'Pending' | 'Failure';
            title: string;
            amount: Big;
            date: Date;
        }[]
    >;
</script>

<Stack>
    {#await histories}
        <Loader />
    {:then result}
        {#each result as history (history.hash)}
            <Group position="apart" noWrap>
                <Stack spacing="xs" align="flex-start">
                    <Text size="xs" color="gray">
                        {history.date.toLocaleString()}
                    </Text>
                    <Text lineClamp={1}>
                        {history.title}
                    </Text>
                    {#if history.status === 'Success'}
                        <Badge size="xs" color="green">Success</Badge>
                    {:else if history.status === 'Pending'}
                        <Badge size="xs" color="LightYellow">Pending</Badge>
                    {:else}
                        <Badge size="xs" color="orange">Failure</Badge>
                    {/if}
                </Stack>
                <Text align="right">
                    {toDefaultFormat(history.amount)}
                </Text>
            </Group>
        {/each}
    {:catch error}
        <Text color="red">{error.message}</Text>
    {/await}
</Stack>
