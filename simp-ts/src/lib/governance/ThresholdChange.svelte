<script lang="ts">
    import { Button, Group, InputWrapper, Paper, Stack, Text, TextInput } from '@svelteuidev/core';
    import { parseNumber, parseSignatures, parseTimestamp } from '../utils/input-transformer';
    import type { Timestamp } from '../utils/timestamp';

    export let threshold = '';
    export let deadline = '';
    export let signatures = '';
    export let sigThreshold: number;
    export let onUpdateModThresholdSign: (
        threshold: number,
        deadline: Timestamp
    ) => Promise<string>;
    export let onUpdateModThreshold: (
        threshold: number,
        deadline: Timestamp,
        signatures: string[]
    ) => void;
    let newSignature = '';
    $: fThreshold = parseNumber(threshold, true);
    $: fDeadline = parseTimestamp(deadline);
    $: fSignatures = parseSignatures(signatures);
    $: isSignDisabled =
        threshold === '' || fThreshold.error !== '' || deadline === '' || fDeadline.error !== '';
    $: isSubmitDisabled =
        threshold === '' ||
        fThreshold.error !== '' ||
        deadline === '' ||
        fDeadline.error !== '' ||
        fSignatures.value.length < sigThreshold - 1 ||
        fSignatures.error != '';

    function handleSubmit() {
        onUpdateModThreshold(fThreshold.value, fDeadline.value, fSignatures.value);
    }

    function handleSign() {
        onUpdateModThresholdSign(fThreshold.value, fDeadline.value).then((signature) => {
            newSignature = signature;
        });
    }
</script>

<Group noWrap>
    <Stack align="stretch">
        <Text weight={'semibold'}>Update Multisig Threshold</Text>

        <TextInput label="New Threshold" placeholder="threshold" bind:value={threshold} />

        <TextInput
            label="Deadline"
            description="Please provide a deadline for the signature in UTC timestamp in seconds"
            bind:value={deadline}
        />

        {#if newSignature !== ''}
            <Stack>
                <Text>Your signature!</Text>
                <Paper><Text>{newSignature}</Text></Paper>
            </Stack>
        {/if}

        <InputWrapper
            label="Signatures"
            description="Paste your signatures here separated by new line"
        >
            <textarea bind:value={signatures} />
        </InputWrapper>

        <Group noWrap>
            <Button variant="outline" ripple disabled={isSignDisabled} on:click={handleSign}
                >Sign</Button
            >
            <Button variant="outline" ripple disabled={isSubmitDisabled} on:click={handleSubmit}>
                Submit Signatures
            </Button>
        </Group>
    </Stack>
</Group>
