import "../styles/globals.css";
import React, {useState, useEffect} from "react";
// import { ThemeProvider, CSSReset } from "@chakra-ui/react";
import {
  ChakraProvider,
  cookieStorageManager,
  localStorageManager,
  ThemeProvider, 
  CSSReset 
} from "@chakra-ui/react"
import { AuthProvider } from "../AuthContext";
import {useRouter} from "next/router";
import theme from "../theme"
import Loading from "../components/Loading";
import 'antd/dist/antd.css';

function MyApp({ Component, pageProps }) {
    const router = useRouter();
    const colorModeManager =
      typeof pageProps.cookies === "string"
        ? cookieStorageManager(pageProps.cookies)
        : localStorageManager;
    const [loading, setLoading] = useState(false);

    useEffect(() => {
        const handleStart = (url) => (url !== router.asPath) && setLoading(true);
        const handleComplete = (url) => setLoading(false);

        router.events.on('routeChangeStart', handleStart)
        router.events.on('routeChangeComplete', handleComplete)
        router.events.on('routeChangeError', handleComplete)

        return () => {
            router.events.off('routeChangeStart', handleStart)
            router.events.off('routeChangeComplete', handleComplete)
            router.events.off('routeChangeError', handleComplete)
        }
    }, [])
    

  return (
    <AuthProvider>
      <ChakraProvider theme={theme} colorModeManager={colorModeManager}>
        <CSSReset /> 
        {loading ? <Loading /> : <Component {...pageProps} />}
      </ChakraProvider>
    </AuthProvider>
  );
}

export default MyApp;
