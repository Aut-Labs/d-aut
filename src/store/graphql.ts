import { ApolloClient, InMemoryCache } from '@apollo/client';
import { env } from '../services/web3/env';

export const apolloClient = new ApolloClient({
  uri: env.REACT_APP_GRAPH_API_URL,
  cache: new InMemoryCache(),
});
