import React, { createContext, useState, useContext } from "react";
import { ApolloClient, InMemoryCache, HttpLink } from "@apollo/client";
import { ApolloProvider } from "@apollo/react-hooks";

const uri = process.env.NODE_ENV === "production" ? "https://masterit-backend.herokuapp.com": "http://localhost:5001"

const AuthContext: any = createContext(null);
// TODO: put the user ID in this class so it can be used

export function AuthProvider({ children }) {
  const auth: any = useProviderAuth();

  return (
    <AuthContext.Provider value={auth}>
      <ApolloProvider client={auth.createApolloClient()}>
        {children}
      </ApolloProvider>
    </AuthContext.Provider>
  );
}

function useProviderAuth() {
  const [accessToken, setAccessToken] = useState<string | null>(null);
  const [refreshToken, setRefreshToken] = useState<string | null>(null);

  const isSignedIn = () => {
    if (accessToken || accessToken !== "") {
      return true;
    } else {
      return false;
    }
  };

  const logout = () => {
    setAccessToken(null);
    setRefreshToken(null);
    localStorage.clear();
  };

  const getTokenInfo = () => {
    if (!accessToken) return null;

    let base64Url = accessToken.split(".")[1];
    let info = JSON.parse(window.atob(base64Url));

    return info;
  };

  const getAuthHeaders = () => {
    if (!accessToken) return null;
    return {
      authorization: `Bearer ${accessToken}`,
    };
  };

  const createApolloClient = () => {
    const link = new HttpLink({
      uri: `http://localhost:5001/graphql`,
      credentials: "include",
      headers: getAuthHeaders(),
    });

    return new ApolloClient({
      link,
      credentials: "include",
      cache: new InMemoryCache(),
    });
  };

  return {
    accessToken,
    setAccessToken,
    isSignedIn,
    createApolloClient,
    refreshToken,
    setRefreshToken,
    logout,
    getTokenInfo,
  };
}

export const useAuth = () => {
  return useContext(AuthContext);
};
