import { useEffect, useState } from 'react';
import AutSDK from '@aut-labs-private/sdk';
import { useAppDispatch } from '../../store/store.model';
import { WalletConnectConnector } from '@usedapp/wallet-connect-connector';
import { env } from '../web3/env';
import { NetworkConfig } from './web3.connectors';
import { ethers } from 'ethers';
import { Config, DAppProvider, MetamaskConnector } from '@usedapp/core';
import { setNetworks } from '../../store/wallet-provider';
import axios from 'axios';

const generateConfig = (networks: NetworkConfig[]): Config => {
  const readOnlyUrls = networks.reduce((prev, curr) => {
    if (!curr.disabled) {
      const network = {
        name: 'mumbai',
        chainId: 80001,
        _defaultProvider: (providers) => new providers.JsonRpcProvider(curr.rpcUrls[0]),
      };
      const provider = ethers.getDefaultProvider(network);
      prev[curr.chainId] = provider;
    }
    return prev;
  }, {});

  return {
    readOnlyUrls,
    notifications: {
      expirationPeriod: 0,
    },
    autoConnect: false,
    // @ts-ignore
    networks: networks
      .filter((n) => !n.disabled)
      .map((n) => ({
        isLocalChain: false,
        isTestChain: process.env.NEXT_PUBLIC_NETWORK_ENV === 'testing',
        chainId: n.chainId,
        chainName: n.network,
        rpcUrl: n.rpcUrls[0],
        nativeCurrency: n.nativeCurrency,
      })),
    pollingIntervals: networks
      .filter((n) => !n.disabled)
      .reduce((prev, curr) => {
        prev[curr.chainId] = 40000;
        return prev;
      }, {}),
    gasLimitBufferPercentage: 50000,
    connectors: {
      metamask: new MetamaskConnector(),
      walletConnect: new WalletConnectConnector({
        rpc: networks
          .filter((n) => !n.disabled)
          .reduce((prev, curr) => {
            // eslint-disable-next-line prefer-destructuring
            prev[curr.chainId] = curr.rpcUrls[0];
            return prev;
          }, {}),
        infuraId: 'd8df2cb7844e4a54ab0a782f608749dd',
      }),
    },
  };
};

export const getAppConfig = (): Promise<NetworkConfig[]> => {
  return axios.get(`${env.REACT_APP_API_URL}/autid/config/network/testing`).then((r) => r.data);
};

export default function Web3AutProvider({ children }) {
  const dispatch = useAppDispatch();
  const [config, setConfig] = useState<Config>(null);

  useEffect(() => {
    getAppConfig().then(async (res: NetworkConfig[]) => {
      const networks = res.filter((n) => !n.disabled);
      dispatch(setNetworks(networks));
      setConfig(generateConfig(networks));
      const sdk = new AutSDK({
        nftStorageApiKey: env.REACT_APP_NFT_STORAGE_KEY,
      });
    });
  }, []);

  // useEffect(() => {
  //   const sdk = new AutSDK({
  //     nftStorageApiKey: env.REACT_APP_NFT_STORAGE_KEY,
  //   });
  //   const networks = [
  //     {
  //       network: env.REACT_APP_NETWORK,
  //       chainId: env.REACT_APP_CHAIN_ID,
  //       explorerUrls: env.REACT_APP_EXPLORER_URLS,
  //       name: env.REACT_APP_NETWORK,
  //       rpcUrls: env.REACT_APP_RPC_URLS,
  //     } as NetworkConfig,
  //   ];
  //   dispatch(setNetworks(networks));
  //   setConfig(generateConfig(networks));
  // }, []);
  return <>{!!config && <DAppProvider config={config}>{children}</DAppProvider>}</>;
}
