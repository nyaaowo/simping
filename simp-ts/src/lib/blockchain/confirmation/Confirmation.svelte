<script lang="ts">
    import { Badge, Button, Divider, Grid, Group, Stack, Text } from '@svelteuidev/core';
    import type Big from 'big.js';

    export let chainName: string;
    export let contractAddress: string;
    export let action: string;
    export let amount: Big;
    export let gasFee: Big;
    export let onReject: () => void;
    export let onConfirm: () => void;

    $: totalAmount = amount.add(gasFee);
</script>

<Stack spacing="xs">
    <Group position="right">
        <Badge size="xl" radius="sm" variant="outline">
            {chainName}
        </Badge>
    </Group>
    <Divider />
    <Text>Contract: {contractAddress}</Text>
    <Divider />
    <Text variant="gradient" size="xl">{action}</Text>
    <Grid>
        <Grid.Col span={8}>Amount</Grid.Col>
        <Grid.Col span={4}>{amount}</Grid.Col>
        <Grid.Col span={8}>Gas Fee</Grid.Col>
        <Grid.Col span={4}>{gasFee}</Grid.Col>
        <Grid.Col span={8}>Total</Grid.Col>
        <Grid.Col span={4}>{totalAmount}</Grid.Col>
    </Grid>
    <Group grow position="apart">
        <Button variant="light" color="red" on:click={onReject}>Reject</Button>
        <Button variant="outline" on:click={onConfirm}>Confirm</Button>
    </Group>
</Stack>
