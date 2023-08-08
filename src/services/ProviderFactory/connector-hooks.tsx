import { useSelector } from 'react-redux';
import { useAppDispatch } from '../../store/store.model';
import { NetworksConfig, setSelectedNetwork, updateWalletProviderState } from '../../store/wallet-provider';
import { ResultState, setStatus, updateErrorState } from '../../store/aut.reducer';
import { InternalErrorTypes } from '../../utils/error-parser';
import { Connector, useConnect } from 'wagmi';

export const useWeb3ReactConnectorHook = () => {
  const { connectAsync } = useConnect();
  const dispatch = useAppDispatch();
  const networks = useSelector(NetworksConfig);

  const changeConnector = async (connector: Connector) => {
    try {
      const [network] = networks.filter((d) => !d.disabled);
      const client = await connectAsync({ connector, chainId: Number(network.chainId) });
      return client.account;
    } catch (error) {
      const itemsToUpdate = {
        isAuthorised: false,
        sdkInitialized: false,
        selectedWalletType: null,
        isOpen: false,
        selectedNetwork: null,
        signer: null,
      };
      await dispatch(updateWalletProviderState(itemsToUpdate));
      await dispatch(setSelectedNetwork(null));
      await dispatch(setStatus(ResultState.Failed));
      dispatch(updateErrorState(InternalErrorTypes.FailedToSwitchNetwork));
      return false;
      // console error
    }
  };

  return { connect: changeConnector };
};
