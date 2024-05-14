import {
  ApolloClient,
  InMemoryCache,
  createHttpLink,
  ApolloProvider,
  gql,
} from "@apollo/client";
import * as SecureStore from "expo-secure-store";
import { setContext } from "@apollo/client/link/context";

const httpLink = createHttpLink({
  uri: "https://fb-apps.rezaarga.xyz/",
});

const authLink = setContext(async (_, { headers }) => {
  // get the authentication token from local storage if it exists
  const token = await SecureStore.getItemAsync("access_token");
  // return the headers to the context so httpLink can read them
  return {
    headers: {
      ...headers,
      authorization: token ? `Bearer ${token}` : "",
    },
  };
});

const client = new ApolloClient({
  link: authLink.concat(httpLink),
  cache: new InMemoryCache(),
});

export default client;
