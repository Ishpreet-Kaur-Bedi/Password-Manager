import { ChakraProvider } from "@chakra-ui/react";

// this will do https request form the server

import { QueryClient, QueryClientProvider } from "react-query";
import "../styles/globals.css";
import type { AppProps } from "next/app";

const queryClient = new QueryClient();

function MyApp({ Component, pageProps }: AppProps) {
  return (
    <QueryClientProvider client={queryClient}>
      <ChakraProvider>
        <Component {...pageProps} />
      </ChakraProvider>
    </QueryClientProvider>
  );
}

export default MyApp;
