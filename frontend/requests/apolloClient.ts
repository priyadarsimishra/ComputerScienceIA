import { ApolloClient, HttpLink, InMemoryCache } from "@apollo/client";
import getConfig from "next/config";

const { publicRuntimeConfig } = getConfig();

function createApolloClient() {
  return new ApolloClient({
    ssrMode: typeof window === "undefined",
    link: new HttpLink({
      uri: "http://localhost:5000/",
      credentials: "same-origin",
      headers: {
        // or any other values for the http request
        lang: "en",
      },
    }),
    cache: new InMemoryCache(),
  });
}

export default createApolloClient;
