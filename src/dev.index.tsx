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
      setStateChangeCallback: null,
      state: null,
      connectors: [],
      networks: [],
      connect: async () => null,
      disconnect: async () => null,
    },
    config,
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
