/**
 * The external imports
 */
import { useState } from 'react'
import { ChakraProvider } from '@chakra-ui/react'
import { Provider } from 'react-redux'
import { createStandaloneToast } from '@chakra-ui/toast'
import { appWithTranslation } from 'next-i18next'
import { ErrorBoundary } from 'react-error-boundary'
import type { AppProps } from 'next/app'

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
import theme from '@/lib/theme'
import Layout from '@/lib/layouts/default'
import { wrapper } from '@/lib/store'
import { AppErrorFallback } from '@/components'

/**
 * Type definitions
 */
import type { Page } from '@/types/page'
type Props = AppProps & {
  Component: Page
}

const App = ({ Component, ...rest }: Props) => {
  const { store, props } = wrapper.useWrappedStore(rest)
  const { pageProps } = props
  // ReactErrorBoundary doesn't pass in the component stack trace.
  // Capture that ourselves to pass down via render props
  const [errorInfo, setErrorInfo] = useState<{ componentStack: string } | null>(
    null
  )
  const { ToastContainer } = createStandaloneToast()

  const getLayout =
    Component.getLayout || ((page: React.ReactNode) => <Layout>{page}</Layout>)

  return (
    <Provider store={store}>
      <ChakraProvider theme={theme}>
        <ErrorBoundary
          onError={(_error: Error, info: { componentStack: string }) => {
            if (process.env.NODE_ENV === 'production') {
              // TODO: uploadErrorDetails(error, info)
            }
            setErrorInfo(info)
          }}
          fallbackRender={fallbackProps => (
            <AppErrorFallback {...fallbackProps} errorInfo={errorInfo} />
          )}
        >
          {getLayout(<Component {...pageProps} />)}
        </ErrorBoundary>
        <ToastContainer />
      </ChakraProvider>
    </Provider>
  )
}

export default appWithTranslation(App)
