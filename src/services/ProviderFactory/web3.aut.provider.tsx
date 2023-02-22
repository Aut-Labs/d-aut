import { Web3ReactProvider } from '@web3-react/core';
import { useEffect } from 'react';
import { useSelector } from 'react-redux';
import AutSDK from '@aut-labs-private/sdk';
import { useAppDispatch } from '../../store/store.model';
import { NetworkConnectors, setNetworks } from '../../store/wallet-provider';
import { getAppConfig } from '../web3/api';
import { env } from '../web3/env';
import { NetworkConfig } from './web3.connectors';

export default function Web3AutProvider({ children }) {
  const dispatch = useAppDispatch();
  const connectors = useSelector(NetworkConnectors);

  useEffect(() => {
    console.log(connectors);
  }, [connectors]);

  useEffect(() => {
    // const fetchNetworkData = async () => {
    //   getAppConfig().then(async (res) => {
    //     // dispatch(setNetworks(res));
    //   });
    //   // await dispatch(setNetwork(attributes.network as string));
    // };
    // fetchNetworkData();
    const sdk = new AutSDK({
      nftStorageApiKey: env.REACT_APP_NFT_STORAGE_KEY,
    });
    dispatch(
      setNetworks([
        {
          chainId: env.REACT_APP_CHAIN_ID,
          explorerUrls: env.REACT_APP_EXPLORER_URLS,
          networkName: env.REACT_APP_NETWORK,
          rpcUrls: env.REACT_APP_RPC_URLS,
        } as NetworkConfig,
      ])
    );
  }, []);
  return (
    <>
      {connectors.length > 0 && (
        <Web3ReactProvider network="any" connectors={connectors}>
          {children}
        </Web3ReactProvider>
      )}
    </>
  );
}
