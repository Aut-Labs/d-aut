import { ApolloClient, ApolloLink, HttpLink, InMemoryCache } from '@apollo/client';
import { RetryLink } from '@apollo/client/link/retry';
import { env } from '../services/web3/env';

const retryLink = new RetryLink({
  delay: {
    initial: 300,
    max: 2000,
  },
  attempts: {
    max: 3,
  },
});

const httpLink = new HttpLink({
  uri: env.REACT_APP_GRAPH_API_URL,
});

const link = ApolloLink.from([retryLink, httpLink]);
export const apolloClient = new ApolloClient({
  uri: env.REACT_APP_GRAPH_API_URL,
  cache: new InMemoryCache(),
  link,
});
