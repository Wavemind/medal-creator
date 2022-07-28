/**
 * The external imports
 */
import React from 'react'
import { ChakraProvider } from '@chakra-ui/react'
import { appWithTranslation } from 'next-i18next'
import { Provider } from 'react-redux'
import { PersistGate } from 'redux-persist/lib/integration/react'

/**
 * The internal imports
 */
import theme from '../theme/theme'
import Layout from '../layouts/default'
import { store, persistor } from '../store'

function App({ Component, pageProps }) {
  const getLayout = Component.getLayout || (page => <Layout>{page}</Layout>)

  return (
    <Provider store={store}>
      <PersistGate loading={null} persistor={persistor}>
        <ChakraProvider theme={theme}>
          {getLayout(<Component {...pageProps} />)}
        </ChakraProvider>
      </PersistGate>
    </Provider>
  )
}

export default appWithTranslation(App)
