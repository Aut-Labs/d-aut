import { DeployedContracts } from '@aut-labs/sdk';

export interface NetworkConfig {
  network: string;
  name?: string;
  chainId: string | number;
  rpcUrls: string[];
  explorerUrls: string[];
  contracts: DeployedContracts;
  disabled?: boolean;
  nativeCurrency?: any;
}

export interface AutId {
  tokenId: string;
  metadataUri: string;
  network: string;
}
