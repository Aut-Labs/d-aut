// eslint-disable-next-line import/no-mutable-exports
export const env = {
  // REACT_APP_API_URL: 'http://localhost:4005/api',
  REACT_APP_NOVA_SHOWCASE_ADDRESS: 'https://showcase.aut.id',
  REACT_APP_API_URL: 'https://api.aut.id/api',
  REACT_APP_GRAPH_API_URL: 'https://api.studio.thegraph.com/query/63763/aut-mumbai/version/latest',
  REACT_APP_API_URL_DEV: 'https://dev-api.aut.id/api',
  REACT_APP_API_URL_LOCAL: 'http://localhost:4005/api',
  REACT_APP_IPFS_API_KEY: '8a0ac0f19f3a824831b9',
  REACT_APP_IPFS_API_SECRET: 'ab123887b809b052a6f6b9122d12707f132ba65f2d0cdd3e6e4f653ac2755c87',
  REACT_APP_IPFS_GATEWAY_URL: 'https://aut.mypinata.cloud/ipfs/',
  REACT_APP_CHAIN_ID: 80001,
  REACT_APP_EXPLORER_URLS: ['https://explorer-mumbai.maticvigil.com/'],
  REACT_APP_NETWORK: 'Mumbai',
  REACT_APP_RPC_URLS: ['https://matic-mainnet.chainstacklabs.com/'],
};

interface ApiUrls {
  tryAut: string;
  novaDashboard: string;
  myAut: string;
  showcase: string;
  leaderboard: string;
  expander: string;
}

export const autUrls = (isDev: boolean): ApiUrls => {
  if (isDev) {
    return {
      tryAut: 'https://try-internal.aut.id/',
      novaDashboard: 'https://nova-internal.aut.id/',
      myAut: 'https://os-internal.aut.id/',
      showcase: 'https://showcase-internal.aut.id/',
      leaderboard: 'https://leaderboard-internal.aut.id/',
      expander: 'https://expander-internal.aut.id/',
    };
  }

  return {
    tryAut: 'https://try.aut.id/',
    novaDashboard: 'https://nova.aut.id/',
    myAut: 'https://my.aut.id/',
    showcase: 'https://showcase.aut.id/',
    leaderboard: 'https://leaderboard.aut.id/',
    expander: 'https://expander.aut.id/',
  };
};
