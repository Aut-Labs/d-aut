import { Web3ReactProvider } from '@web3-react/core';
import { useEffect } from 'react';
import { useSelector } from 'react-redux';
import { useAppDispatch } from '../../store/store.model';
import { NetworkConnectors, setNetworks } from '../../store/wallet-provider';
import { getAppConfig } from '../web3/api';

export default function Web3AutProvider({ children }) {
  const dispatch = useAppDispatch();
  const connectors = useSelector(NetworkConnectors);

  useEffect(() => {
    const fetchNetworkData = async () => {
      getAppConfig().then(async (res) => dispatch(setNetworks(res)));
      // await dispatch(setNetwork(attributes.network as string));
    };
    fetchNetworkData();
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
