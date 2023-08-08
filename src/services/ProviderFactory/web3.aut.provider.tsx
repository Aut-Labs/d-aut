import { useEffect, useState } from 'react';
import AutSDK from '@aut-labs/sdk';
import { useAppDispatch } from '../../store/store.model';
import { env } from '../web3/env';
import { NetworkConfig } from './web3.connectors';
import { setNetworks } from '../../store/wallet-provider';
import axios from 'axios';
import { alchemyProvider } from 'wagmi/providers/alchemy';
import { MetaMaskConnector } from 'wagmi/connectors/metaMask';
import { WalletConnectConnector } from 'wagmi/connectors/walletConnect';
import { Chain, ChainProviderFn, WagmiConfig, configureChains, createConfig } from 'wagmi';

export const generateNetworkConfig = (network: NetworkConfig) => {
  const networkDefinition = {
    id: network.chainId,
    name: network.name,
    network: network.network,
    rpcUrls: {
      default: {
        http: network.rpcUrls,
      },
      public: {
        http: network.rpcUrls,
      },
    },
    blockExplorers: {
      etherscan: {
        name: network.name,
        url: network.explorerUrls[0],
      },
      default: {
        name: network.name,
        url: network.explorerUrls[0],
      },
    },
    testnet: true,
  };

  const ankrRPCUrls = {
    [networkDefinition.id]: network.rpcUrls,
  };
  const publicProviderANKR = <TChain extends Chain = Chain>(): ChainProviderFn<TChain> => {
    return (chain) => {
      if (!ankrRPCUrls[chain.id]) return null;
      return {
        chain: chain as TChain,
        rpcUrls: { http: ankrRPCUrls[chain.id] },
      };
    };
  };

  const { chains, publicClient, webSocketPublicClient } = configureChains(
    [networkDefinition as any],
    [alchemyProvider({ apiKey: 'G742dEaaWF0gE-SL0IlEFAJdlA_l7ezJ' }), publicProviderANKR()]
  );

  const wagmiConfig = createConfig({
    autoConnect: true,
    logger: {
      warn: console.warn,
    },
    connectors: [
      new MetaMaskConnector({
        chains,
      }),
      new WalletConnectConnector({
        chains,
        options: {
          projectId: '938429658f5e53a8eaf88dc70e4a8367',
          qrModalOptions: {
            themeVariables: {
              // @ts-ignore
              '--wcm-z-index': 9999,
            },
          },
        },
      }),
    ],
    publicClient,
    webSocketPublicClient,
  });

  return wagmiConfig;
};
export const getAppConfig = (): Promise<NetworkConfig[]> => {
  return axios.get(`${env.REACT_APP_API_URL}/autid/config/network/testing`).then((r) => r.data);
};

export default function Web3AutProvider({ children }) {
  const dispatch = useAppDispatch();
  const [config, setConfig] = useState(null);

  useEffect(() => {
    getAppConfig().then(async (res: NetworkConfig[]) => {
      const networks = res.filter((n) => !n.disabled);
      dispatch(setNetworks(networks));
      const [network] = res.filter((d) => !d.disabled);
      setConfig(generateNetworkConfig(network));
      const sdk = new AutSDK({
        nftStorageApiKey: env.REACT_APP_NFT_STORAGE_KEY,
      });
    });
  }, []);

  return <>{!!config && <WagmiConfig config={config}>{children}</WagmiConfig>}</>;
}
