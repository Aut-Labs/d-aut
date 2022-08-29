// import { environment, EnvMode } from '@api/environment';
import { env } from '../web3/env';

export const toHex = (num) => {
  const val = Number(num);
  return `0x${val.toString(16)}`;
};

export const EnableAndChangeNetwork = async (provider: any, config: any) => {
  console.info('Changing Network', config);
  const params = [
    {
      chainId: toHex(config.network.chainId),
      chainName: config.network.name,
      rpcUrls: config.network.rpcUrls,
      blockExplorerUrls: config.network.blockExplorerUrls,
    },
  ];

  const [{ chainId }] = params;

  try {
    await provider.request({ method: 'eth_requestAccounts' });
    await provider.request({
      method: 'wallet_switchEthereumChain',
      params: [{ chainId }],
    });
  } catch (switchError) {
    // This error code indicates that the chain has not been added to MetaMask.
    if (switchError.code === 4902) {
      try {
        await provider.request({
          method: 'wallet_addEthereumChain',
          params,
        });
      } catch (addError) {
        throw new Error(addError);
      }
    } else {
      throw new Error(switchError);
    }
  }
};
