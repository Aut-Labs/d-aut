import { useContext, useState } from 'react';
import { useSelector } from 'react-redux';
import { useAppDispatch } from '../../store/store.model';
import AutSDK, { AutID } from '@aut-labs-private/sdk';
import { NetworksConfig, SelectedWalletType, setSelectedNetwork, updateWalletProviderState } from '../../store/wallet-provider';
import { DAOExpanderAddress, ResultState, setStatus, updateErrorState } from '../../store/aut.reducer';
import { InternalErrorTypes } from '../../utils/error-parser';
import { JsonRpcSigner } from '@ethersproject/providers';
import { NetworkConfig } from './web3.connectors';
import { useAutWalletConnect } from './use-aut-wallet-connect';
import { BiconomyContext } from '../../biconomy_context';

export const useWeb3ReactConnectorHook = () => {
  const { connect, isLoading: isConnecting, ...rest } = useAutWalletConnect();
  const [isLoading, setIsLoading] = useState(false);
  const dispatch = useAppDispatch();
  const networks = useSelector(NetworksConfig);
  const daoExpanderAddress = useSelector(DAOExpanderAddress);
  const wallet = useSelector(SelectedWalletType);
  const BiconomyRef = useContext(BiconomyContext);

  const initializeSDK = async (network: NetworkConfig, signer: JsonRpcSigner) => {
    const sdk = AutSDK.getInstance();
    let autIdContractAddress = network?.contracts?.autIDAddress;

    // If dao expander is provided then to ensure is the correct autId address
    // we will fetch contract address from daoExpanderAddress contract
    if (daoExpanderAddress) {
      // only when daoExpanderAddress is present we can create a new user
      // and so only then we should inject biconomy
      const biconomy =
        network?.biconomyApiKey &&
        BiconomyRef &&
        new BiconomyRef({
          enableDebugMode: true,
          apiKey: network.biconomyApiKey,
          contractAddresses: [autIdContractAddress],
        });
      await sdk.init(
        signer,
        {
          daoExpanderAddress,
        },
        biconomy
      );
      const result = await sdk.daoExpander.contract.getAutIDContractAddress();
      autIdContractAddress = result?.data;
      sdk.autID = sdk.initService<AutID>(AutID, autIdContractAddress);
    } else {
      await sdk.init(signer, {
        autIDAddress: autIdContractAddress,
      });
    }
  };

  const changeConnector = async (connectorType: string) => {
    try {
      const [network] = networks.filter((d) => !d.disabled);
      const { provider, connected, account } = await connect(connectorType);
      if (!connected) throw new Error('not connected');
      const signer = provider.getSigner();
      const itemsToUpdate = {
        isAuthorised: connected,
        sdkInitialized: true,
        selectedWalletType: wallet,
        isOpen: false,
        selectedNetwork: network?.network,
        signer,
      };
      if (!wallet) {
        delete itemsToUpdate.selectedWalletType;
      }
      setIsLoading(true);
      await dispatch(updateWalletProviderState(itemsToUpdate));
      await initializeSDK(network, signer as JsonRpcSigner);
      setIsLoading(false);
      return account;
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
      setIsLoading(false);
      return false;
      // console error
    }
  };

  return { connect: changeConnector, isLoading: isConnecting || isLoading, ...rest };
};
