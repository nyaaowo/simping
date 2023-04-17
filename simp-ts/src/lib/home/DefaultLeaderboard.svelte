<script lang="ts">
    import { goto } from '$app/navigation';
    import Leaderboard from '$lib/leaderboard/Leaderboard.svelte';
    import type { TextDonationSortOption } from '$lib/leaderboard/text-donation.repository';
    import { currentPower } from '$lib/power/power';

    let limit = 10;
    let sortType: TextDonationSortOption = 'Recent';
    $: allDonations = $currentPower.textDonationView.currentDonations(sortType, limit);
    $: donations = $allDonations.map((value) => {
        return {
            amount: value.amount,
            message: value.message,
            id: value.id
        };
    });
    function sortByRecent() {
        sortType = 'Recent';
    }

    function sortByHighest() {
        sortType = 'Highest';
    }

    function routeToDonation() {
        goto(`/text-donation`);
    }
</script>

<Leaderboard
    {donations}
    selectRecent={sortByRecent}
    selectHighest={sortByHighest}
    onDonate={routeToDonation}
/>
