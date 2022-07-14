/**
 * The external imports
 */
import React from 'react';
import { ChakraProvider } from '@chakra-ui/react'
import { appWithTranslation } from 'next-i18next'

/**
 * The internal imports
 */
import theme from '../theme/theme'

function App({ Component, pageProps }) {
  return (
    <ChakraProvider theme={theme}>
      <Component {...pageProps} />
    </ChakraProvider>
  )
}

export default appWithTranslation(App)
