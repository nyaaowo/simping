<script lang="ts">
    import { toDefaultFormat } from '$lib/utils/number';
    import { Grid, Paper, Text } from '@svelteuidev/core';
    import type Big from 'big.js';

    export let index: number;
    export let message: string;
    export let amount: Big;
</script>

<Paper>
    <Grid>
        <Grid.Col span={2}>
            <Text align="right" lineClamp={1}>
                {index}
            </Text>
        </Grid.Col>
        <Grid.Col span={6}>
            <Text lineClamp={4}>{message}</Text>
        </Grid.Col>
        <Grid.Col span={4}>
            <Text lineClamp={1} align="right">
                {toDefaultFormat(amount)}
            </Text>
        </Grid.Col>
    </Grid>
</Paper>
