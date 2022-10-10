import { Web3ReactHooks, Web3ReactProvider } from '@web3-react/core';
import { MetaMask } from '@web3-react/metamask';
import { WalletConnect } from '@web3-react/walletconnect';
import { metaMaskConnector, walletConnectConnector } from './web3.connectors';

const [metamask, metaMaskHooks] = metaMaskConnector;
const [walletConnect, walletConnectHooks] = walletConnectConnector;

const connectors: [MetaMask | WalletConnect, Web3ReactHooks][] = [
  [metamask, metaMaskHooks],
  [walletConnect, walletConnectHooks],
];

export default function Web3AutProvider({ children }) {
  return (
    <Web3ReactProvider network="any" connectors={connectors}>
      {children}
    </Web3ReactProvider>
  );
}
