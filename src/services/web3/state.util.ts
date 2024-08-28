import { DAutHub } from '../../interfaces/hub.model';
import { RootState } from '../../store/store.model';
import { NetworkConfig } from '../../types/network';

export const stateDetails = (
  state: RootState
): {
  hubAddress: string;
  ipfsGateway: string;
  hub: DAutHub;
  selectedNetwork: NetworkConfig;
  userData: typeof state.userData;
} => {
  const hubAddress: string = state.aut.selectedUnjoinedHubAddress || state.aut.hubAddress;
  const ipfsGateway: string = state.walletProvider.customIpfsGateway;

  return {
    hubAddress,
    ipfsGateway,
    selectedNetwork: state.walletProvider.selectedNetwork,
    hub: state.aut.hub,
    userData: state.userData,
  };
};
