export interface ChainNetwork {
    name: string;
    chainId: number;
}

export const AllSupportedChains = [
    {
        name: 'Arbitrum Goerli',
        chainId: 421613
    },
    {
        name: 'Arbitrum One',
        chainId: 42161
    },
    {
        name: 'Arbitrum Nova',
        chainId: 42170
    },
    {
        name: 'Optimism',
        chainId: 10
    }
] as const;
export type SupportedChain = (typeof AllSupportedChains)[number];
