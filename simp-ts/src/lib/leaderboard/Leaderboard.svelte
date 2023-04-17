<script lang="ts">
    import type { EventId } from '$lib/blockchain/event';
    import LeaderboardItem from '$lib/leaderboard/LeaderboardItem.svelte';
    import { Button, Group, Paper, Stack, Text } from '@svelteuidev/core';
    import type Big from 'big.js';

    export let donations: {
        message: string;
        amount: Big;
        id: EventId;
    }[];
    export let selectRecent: () => void;
    export let selectHighest: () => void;
    export let onDonate: () => void;

    const donateButtonStyle = {
        width: '30%',
        marginInlineStart: 'auto'
    };
</script>

<Stack>
    <Group>
        <Button variant="subtle" compact ripple on:click={selectRecent}>Recent</Button>
        <Button variant="subtle" compact ripple on:click={selectHighest}>Highest</Button>
    </Group>
    <Paper withBorder>
        <Stack>
            <Text>Donation Leaderboard</Text>
            {#each donations as donation, i (donation.id)}
                <LeaderboardItem
                    index={i + 1}
                    message={donation.message}
                    amount={donation.amount}
                />
            {/each}
        </Stack>
    </Paper>
    <Button variant="outline" override={donateButtonStyle} on:click={onDonate}>Donate</Button>
</Stack>
