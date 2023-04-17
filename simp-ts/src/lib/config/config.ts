import myConfig from '../config/config.json';

/**
 * For config file to be read at startup
 */
export interface Config {
    /**
     * Default Chain Options
     */
    chain: {
        name: string;
        chainId: number;
    };
    /**
     * Simp contract address
     */
    contractAddress: string;
    /**
     * Url regex that can be safely shown as image
     */
    whitelistedImageUrls: string[];
}

export const CONFIG: Config = myConfig;
