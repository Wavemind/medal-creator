/**
 * The external imports
 */
import React from 'react'
import { ChakraProvider } from '@chakra-ui/react'
import { createStandaloneToast } from '@chakra-ui/toast'
import { appWithTranslation } from 'next-i18next'
import { Provider } from 'react-redux'

/**
 * Add fonts
 */
import '@fontsource/ibm-plex-sans/100.css'
import '@fontsource/ibm-plex-sans/200.css'
import '@fontsource/ibm-plex-sans/300.css'
import '@fontsource/ibm-plex-sans/400.css'
import '@fontsource/ibm-plex-sans/500.css'
import '@fontsource/ibm-plex-sans/600.css'
import '@fontsource/ibm-plex-sans/700.css'
import '@fontsource/ibm-plex-mono'

/**
 * The internal imports
 */
import theme from '/lib/theme'
import Layout from '/lib/layouts/default'
import { wrapper } from '../lib/store'

function App({ Component, ...rest }) {
  const { store, props } = wrapper.useWrappedStore(rest)
  const { ToastContainer } = createStandaloneToast()
  const getLayout = Component.getLayout || (page => <Layout>{page}</Layout>)

  return (
    <Provider store={store}>
      <ChakraProvider theme={theme}>
        {getLayout(<Component {...props.pageProps} />)}
        <ToastContainer />
      </ChakraProvider>
    </Provider>
  )
}

export default appWithTranslation(App)
