import { initializeConnector } from '@web3-react/core';
import { MetaMask } from '@web3-react/metamask';
import { WalletConnect } from '@web3-react/walletconnect';
import { supportedNetworks } from '../web3/env';

const supportedChainIds = supportedNetworks.map((n) => {
  return +n.network.chainId;
});

const supportedRpcs = () => {
  const result = [];
  for (let i = 0; i < supportedNetworks.length; i++) {
    const element = supportedNetworks[i];
    for (let j = 0; j < element.network.rpcUrls.length; j++) {
      result.push(element.network.rpcUrls[j]);
    }
  }
  return result;
};

export const metaMaskConnector = initializeConnector<MetaMask>((actions) => new MetaMask(actions), supportedChainIds);

export const walletConnectConnector = initializeConnector<WalletConnect>(
  (actions) =>
    new WalletConnect(actions, {
      qrcode: true,
      bridge: 'https://bridge.walletconnect.org',
      rpc: supportedRpcs(),
    }),
  supportedChainIds
);
