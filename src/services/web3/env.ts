// eslint-disable-next-line import/no-mutable-exports
export const env = {
  // REACT_APP_API_URL: 'http://localhost:4005/api',
  REACT_APP_NOVA_SHOWCASE_ADDRESS: 'https://showcase.aut.id',
  REACT_APP_API_URL: 'https://api.aut.id/api',
  REACT_APP_API_URL_DEV: 'http://localhost:4005/api',
  REACT_APP_API_URL_LOCAL: 'http://localhost:4005/api',
  REACT_APP_IPFS_URL: 'https://cloudflare-ipfs.com/ipfs',
  REACT_APP_NFT_STORAGE_KEY:
    'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJzdWIiOiJkaWQ6ZXRocjoweDIwQkEyNDNhNTU1YmY4YzI0MzViNzVmMTk0NmFDNWQ2QTY4QUQzMjgiLCJpc3MiOiJuZnQtc3RvcmFnZSIsImlhdCI6MTY0MzkwMjIzNDA2NywibmFtZSI6IlBhcnRuZXJzQXBwIn0.sG-6S0mNp0FQ_4SIimMChrMj4250ymEH58V09eXNY4o',
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
      myAut: 'https://my-internal.aut.id/',
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
