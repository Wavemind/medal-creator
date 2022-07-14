/**
 * The external imports
 */
import { ChakraProvider, Container } from '@chakra-ui/react'
import { appWithTranslation } from 'next-i18next'

/**
 * The internal imports
 */
import theme from '../theme/theme'

function App({ Component, pageProps }) {
  return (
    <ChakraProvider theme={theme}>
      <Container>
        <Component {...pageProps} />
      </Container>
    </ChakraProvider>
  )
}

export default appWithTranslation(App)
