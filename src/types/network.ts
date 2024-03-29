export enum NetworkConfigEnv {
  Testing = 'testing',
  Mainnet = 'mainnet',
}

export interface NetworkContracts {
  autIDAddress: string;
  daoExpanderRegistryAddress: string;
  daoExpanderFactoryAddress: string;
  novaRegistryAddress: string;
  novaFactoryAddress: string;
  hackerDaoAddress: string;
  daoTypesAddress: string;
}

export interface NetworkConfig {
  network: string;
  name?: string;
  chainId: string | number;
  rpcUrls: string[];
  explorerUrls: string[];
  contracts: NetworkContracts;
  disabled?: boolean;
  nativeCurrency?: any;
}

export interface AutId {
  tokenId: string;
  metadataUri: string;
  network: string;
}
