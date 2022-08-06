// eslint-disable-next-line import/no-mutable-exports
export const env = {
  REACT_APP_IPFS_URL: 'https://infura-ipfs.io/ipfs',
  REACT_APP_NFT_STORAGE_KEY:
    'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJzdWIiOiJkaWQ6ZXRocjoweDIwQkEyNDNhNTU1YmY4YzI0MzViNzVmMTk0NmFDNWQ2QTY4QUQzMjgiLCJpc3MiOiJuZnQtc3RvcmFnZSIsImlhdCI6MTY0MzkwMjIzNDA2NywibmFtZSI6IlBhcnRuZXJzQXBwIn0.sG-6S0mNp0FQ_4SIimMChrMj4250ymEH58V09eXNY4o',
};

export const supportedNetworks = [
  {
    autIdAddress: '0x00fbB8e663614f16e85df9634fd116aecF4872F9',
    communityRegistryAddress: '0x5a37DE031A2155425700B6C842968fC2E32EC10f',
    network: {
      chainId: '5',
      chainName: 'Goerli',
      nativeCurrency: {
        name: 'GoerliETH',
        symbol: 'GOR',
        decimals: 18,
      },
      rpcUrls: ['https://goerli.infura.io/v3/', 'https://rpc.goerli.mudit.blog'],
      blockExplorerUrls: ['https://goerli.etherscan.io/'],
    },
  },
  {
    autIdAddress: '0xC866514E817893188CFe58030d57F50f62ADE319',
    communityRegistryAddress: '0xB126D97141E5f379b14988985e18Af93a5C1B938',
    network: {
      chainId: '80001',
      chainName: 'Mumbai',
      nativeCurrency: {
        name: 'Matic',
        symbol: 'MATIC',
        decimals: 18,
      },
      rpcUrls: ['https://matic-mumbai.chainstacklabs.com', 'https://rpc-mumbai.matic.today'],
      blockExplorerUrls: ['https://explorer-mumbai.maticvigil.com/'],
    },
  },
];

export const getNetwork = (name: string) => {
  if (name.toLowerCase() === 'goerli') {
    return supportedNetworks.find((x) => x.network.chainName.toLowerCase() === 'goerli');
  }
  return supportedNetworks.find((x) => x.network.chainName.toLowerCase() === 'mumbai');
};

// export const SKILL_WALLET_API = `https://${useDev ? 'dev.' : ''}api.skillwallet.id/api`;
// export const DITO_API = `https://${useDev ? 'dev.' : ''}api.distributed.town/api`;
// export const RPCs = useDev ? ['https://matic-mumbai.chainstacklabs.com', 'https://rpc-mumbai.matic.today'] : ['https://polygon-rpc.com'];
// export const BLOCKED_EXPLORER_URLS = useDev ? ['https://explorer-mumbai.maticvigil.com/'] : ['https://polygonscan.com/'];
