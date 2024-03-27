// THIS FILE IS FOR DEVELOPMENT ONLY!!!

import { IAutButtonConfig } from './components/AutButtonMenu/AutMenuUtils';
import { Init } from './index';

setTimeout(() => {
  const config: IAutButtonConfig = {
    defaultText: 'Connect Wallet',
    textAlignment: 'right',
    menuTextAlignment: 'left',
    theme: {
      color: 'offWhite',
      // color: 'nightBlack',
      // color: colors.amber['500'],
      // color: '#7b1fa2',
      type: 'main',
    },
    // size: 'default', // large & extraLarge or see below
    size: {
      width: 260,
      height: 60,
      padding: 3,
    },
  };
  Init({
    connector: {
      connect: async () => null,
      disconnect: async () => null,
      setStateChangeCallback: () => null,
      connectors: [
        {
          id: 'web3auth',
          name: 'Web3Auth',
          type: 'Web3Auth',
          emitter: {
            uid: '84370ff0d34',
          },
          uid: '84370ff0d34',
        },
        {
          id: 'metaMask',
          name: 'MetaMask',
          type: 'injected',
          emitter: {
            uid: '4370ff0d344',
          },
          uid: '4370ff0d344',
        },
        {
          id: 'walletConnect',
          name: 'WalletConnect',
          type: 'walletConnect',
          requestedChainsStorageKey: 'walletConnect.requestedChains',
          emitter: {
            uid: '370ff0d3444',
          },
          uid: '370ff0d3444',
        },
        {
          id: 'coinbaseWalletSDK',
          name: 'Coinbase Wallet',
          type: 'coinbaseWallet',
          emitter: {
            uid: '70ff0d34443',
          },
          uid: '70ff0d34443',
        },
      ] as any,
      networks: [],
      state: {
        multiSignerId: null,
        multiSigner: null,
        isConnected: false,
        isConnecting: false,
        status: 'disconnected',
        address: null,
      } as any,
    },
    config,
    envConfig: {
      REACT_APP_API_URL: '',
      REACT_APP_GRAPH_API_URL: '',
      REACT_APP_IPFS_API_KEY: '',
      REACT_APP_IPFS_API_SECRET: '',
      REACT_APP_IPFS_GATEWAY_URL: '',
    },
  });
  // setInterval(() => {
  //   const el: HTMLElement = document.getElementById('aut');
  //   // const hide = el.getAttribute('nova-address');
  //   const network = JSON.stringify({
  //     name: 'Mumbai (Polygon)',
  //     chainId: 80001,
  //     network: 'Mumbai',
  //     disabled: false,
  //     explorerUrls: ['https://explorer-mumbai.maticvigil.com/'],
  //     rpcUrls: ['https://rpc-mumbai.maticvigil.com'],
  //   });
  //   const menuItems = JSON.stringify([
  //     {
  //       name: 'Profile',
  //       actionType: MenuItemActionType.ExternalLink,
  //       link: 'test',
  //     },
  //   ]);
  //   el.setAttribute('menu-items', menuItems);
  //   el.setAttribute('network', network);
  // }, 1000);
}, 100);
