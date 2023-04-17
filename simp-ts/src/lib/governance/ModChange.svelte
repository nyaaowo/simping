<script lang="ts">
    import {
        Button,
        Group,
        InputWrapper,
        NativeSelect,
        Paper,
        Stack,
        Text,
        TextInput
    } from '@svelteuidev/core';
    import type { Address } from '../blockchain/address';
    import { parseAddress, parseSignatures, parseTimestamp } from '../utils/input-transformer';
    import type { Timestamp } from '../utils/timestamp';

    export let action: 'Promote' | 'Demote' = 'Promote';
    export let mod = '';
    export let deadline = '';
    export let signatures = '';
    export let sigThreshold: number;
    export let onPromote: (mod: Address, deadline: Timestamp, signatures: string[]) => void;
    export let onDemote: (mod: Address, deadline: Timestamp, signatures: string[]) => void;
    export let onPromoteSign: (mod: Address, deadline: Timestamp) => Promise<string>;
    export let onDemoteSign: (mod: Address, deadline: Timestamp) => Promise<string>;
    let newSignature = '';
    $: fMod = parseAddress(mod);
    $: fDeadline = parseTimestamp(deadline);
    $: fSignatures = parseSignatures(signatures);
    $: isSignDisabled =
        mod === '' || fMod.error !== '' || deadline === '' || fDeadline.error !== '';
    $: isSubmitDisabled =
        mod === '' ||
        fMod.error !== '' ||
        deadline === '' ||
        fDeadline.error !== '' ||
        fSignatures.value.length < sigThreshold - 1 ||
        fSignatures.error != '';

    function handleSubmit() {
        if (action === 'Promote') {
            onPromote(fMod.value, fDeadline.value, fSignatures.value);
        } else if (action === 'Demote') {
            onDemote(fMod.value, fDeadline.value, fSignatures.value);
        }
    }

    function handleSign() {
        if (action === 'Promote') {
            onPromoteSign(fMod.value, fDeadline.value).then((signature) => {
                newSignature = signature;
            });
        } else if (action === 'Demote') {
            onDemoteSign(fMod.value, fDeadline.value).then((signature) => {
                newSignature = signature;
            });
        }
    }
</script>

<Group noWrap>
    <Stack align="stretch">
        <Text weight={'semibold'}>Promote or Demote a Mod</Text>

        <NativeSelect data={['Promote', 'Demote']} bind:value={action} label="Choose an action" />

        <TextInput label="Mod" placeholder="address" bind:value={mod} />
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
