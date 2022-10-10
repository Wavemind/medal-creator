/**
 * The external imports
 */
import React from 'react'
import { ChakraProvider } from '@chakra-ui/react'
import { createStandaloneToast } from '@chakra-ui/toast'
import { appWithTranslation } from 'next-i18next'

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
import { wrapper } from '/lib/store'

export function reportWebVitals(metric) {
  const body = JSON.stringify(metric)
  const url = '/__appsignal-web-vitals'

  // Use `navigator.sendBeacon()` if available, falling back to `fetch()`.
  ;(navigator.sendBeacon && navigator.sendBeacon(url, body)) ||
    fetch(url, { body, method: 'POST', keepalive: true })
}

function App({ Component, pageProps }) {
  const { ToastContainer } = createStandaloneToast()
  const getLayout = Component.getLayout || (page => <Layout>{page}</Layout>)

  return (
    <ChakraProvider theme={theme}>
      {getLayout(<Component {...pageProps} />)}
      <ToastContainer />
    </ChakraProvider>
  )
}

export default wrapper.withRedux(appWithTranslation(App))
