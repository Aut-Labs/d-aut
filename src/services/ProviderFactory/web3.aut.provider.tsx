import { useEffect } from 'react';
import AutSDK from '@aut-labs/sdk';
import { useAppDispatch } from '../../store/store.model';
import { env } from '../web3/env';
import { NetworkConfig } from './web3.connectors';
import { setNetworks } from '../../store/wallet-provider';
import axios from 'axios';
import { injected, walletConnect } from 'wagmi/connectors';
import { WagmiProvider, createConfig, http } from 'wagmi';
import { polygonMumbai, polygon } from 'wagmi/chains';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';

declare module 'wagmi' {
  interface Register {
    config: typeof config;
  }
}

// @ts-ignore
export const config = createConfig({
  chains: [polygonMumbai, polygon],
  connectors: [
    injected({
      shimDisconnect: false,
      target: 'metaMask',
    }),
    walletConnect({ projectId: '938429658f5e53a8eaf88dc70e4a8367' }),
  ],
  transports: {
    [polygonMumbai.id]: http(),
    [polygon.id]: http(),
  },
});

// export const generateNetworkConfig = (network: NetworkConfig) => {
//   // const networkDefinition = {
//   //   id: network.chainId,
//   //   name: network.name,
//   //   network: network.network,
//   //   rpcUrls: {
//   //     default: {
//   //       http: network.rpcUrls
//   //     },
//   //     public: {
//   //       http: network.rpcUrls
//   //     }
//   //   },
//   //   blockExplorers: {
//   //     etherscan: {
//   //       name: network.name,
//   //       url: network.explorerUrls[0]
//   //     },
//   //     default: {
//   //       name: network.name,
//   //       url: network.explorerUrls[0]
//   //     }
//   //   },
//   //   testnet: true
//   // };

//   // const ankrRPCUrls = {
//   //   [networkDefinition.id]: network.rpcUrls
//   // };
//   // function publicProviderANKR<
//   //   TChain extends Chain = Chain
//   // >(): ChainProviderFn<TChain> {
//   //   return function (chain) {
//   //     if (!ankrRPCUrls[chain.id]) return null;
//   //     return {
//   //       chain: chain as TChain,
//   //       rpcUrls: { http: ankrRPCUrls[chain.id] }
//   //     };
//   //   };
//   // }

//   // const { chains, publicClient, webSocketPublicClient } = configureChains(
//   //   [networkDefinition as any],
//   //   [
//   //     alchemyProvider({ apiKey: "G742dEaaWF0gE-SL0IlEFAJdlA_l7ezJ" }),
//   //     publicProviderANKR()
//   //   ]
//   // );

//   const config = createConfig({
//     chains: [polygonMumbai, polygon],
//     transports: {
//       [polygonMumbai.id]: http(),
//       [polygon.id]: http()
//     }
//   });

//   const wagmiConfig = createConfig({
//     autoConnect: true,
//     logger: {
//       warn: console.warn
//     },
//     connectors: [
//       new InjectedConnector({
//         chains,
//         options: {
//           shimDisconnect: true
//         }
//       }),
//       new MetaMaskConnector({
//         chains,
//         options: {
//           shimDisconnect: true
//         }
//       }),
//       new WalletConnectConnector({
//         chains,
//         options: {
//           shimDisconnect: true,
//           projectId: "938429658f5e53a8eaf88dc70e4a8367",
//           qrModalOptions: {
//             themeVariables: {
//               // @ts-ignore
//               "--wcm-z-index": 9999
//             }
//           }
//         }
//       })
//     ],
//     publicClient,
//     webSocketPublicClient
//   });

//   return wagmiConfig;
// };

export const getAppConfig = (): Promise<NetworkConfig[]> => {
  return axios.get(`${env.REACT_APP_API_URL}/autid/config/network/testing`).then((r) => r.data);
};

const queryClient = new QueryClient();

export default function Web3AutProvider({ children }) {
  const dispatch = useAppDispatch();
  // const [config, setConfig] = useState(null);

  useEffect(() => {
    getAppConfig().then(async (res: NetworkConfig[]) => {
      const networks = res.filter((n) => !n.disabled);
      dispatch(setNetworks(networks));
      const [network] = res.filter((d) => !d.disabled);
      // setConfig(generateNetworkConfig(network));
      const sdk = new AutSDK({
        ipfs: {
          apiKey: env.REACT_APP_IPFS_API_KEY,
          secretApiKey: env.REACT_APP_IPFS_API_SECRET,
          gatewayUrl: env.REACT_APP_IPFS_GATEWAY_URL,
        },
      });
    });
  }, []);

  return (
    <>
      <WagmiProvider config={config} reconnectOnMount>
        <QueryClientProvider client={queryClient}>{children}</QueryClientProvider>
      </WagmiProvider>
    </>
  );
}
