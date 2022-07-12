/**
 * The external imports
 */
import { ChakraProvider } from '@chakra-ui/react'

/**
 * The internal imports
 */
import '../styles/globals.css'

function App({ Component, pageProps }) {
  return (
    <ChakraProvider>
      <Component {...pageProps} />
    </ChakraProvider>
  )

}

export default App
