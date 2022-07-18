/**
 * The external imports
 */
import React from "react";
import { ChakraProvider } from "@chakra-ui/react";
import { appWithTranslation } from "next-i18next";

/**
 * The internal imports
 */
import theme from "../theme/theme";
import Layout from "../layouts";

function App({ Component, pageProps }) {
  const getLayout = Component.getLayout || (page => <Layout>{page}</Layout>);

  return (
    <ChakraProvider theme={theme}>
      {getLayout(<Component {...pageProps} />)}
    </ChakraProvider>
  );
}

export default appWithTranslation(App);
