import { ApolloClient, InMemoryCache } from '@apollo/client';
import { env } from '../services/web3/env';

let _apolloClient: ApolloClient<any>;

const getApolloClient = (url: string) => {
  if (!url) {
    throw new Error('No url provided for the Apollo Client');
  }

  if (!_apolloClient) {
    _apolloClient = new ApolloClient({
      uri: url,
      cache: new InMemoryCache(),
    });
  }

  return _apolloClient;
};

export const getGraphClient = (): ApolloClient<any> => getApolloClient(env.REACT_APP_GRAPH_API_URL);
