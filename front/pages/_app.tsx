/**
 * The external imports
 */
import { useState } from 'react'
import { ChakraProvider } from '@chakra-ui/react'
import { Provider } from 'react-redux'
import { createStandaloneToast } from '@chakra-ui/toast'
import { appWithTranslation } from 'next-i18next'
import { ErrorBoundary } from 'react-error-boundary'
import { SessionProvider } from 'next-auth/react'
import { getToken } from 'next-auth/jwt'
import type { AppContext, AppProps } from 'next/app'

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
import { setSession } from '@/lib/store/session'
import { AppErrorFallback } from '@/components'
import type { NextPageWithLayout } from '@/types/page'
import type { ComponentStackProps } from '@/types/common'

/**
 * Type definitions
 */
export type AppPropsWithLayout = AppProps & {
  Component: NextPageWithLayout
}

const App = ({ Component, ...rest }: AppPropsWithLayout) => {
  const { store, props } = wrapper.useWrappedStore(rest)
  const { pageProps } = props
  // ReactErrorBoundary doesn't pass in the component stack trace.
  // Capture that ourselves to pass down via render props
  const [errorInfo, setErrorInfo] = useState<ComponentStackProps>(null)
  const { ToastContainer } = createStandaloneToast()

  const getLayout =
    Component.getLayout || ((page: React.ReactNode) => <Layout>{page}</Layout>)

  return (
    <SessionProvider session={pageProps.session}>
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
    </SessionProvider>
  )
}

App.getInitialProps = wrapper.getInitialAppProps(
  store =>
    async ({ ctx, Component }) => {
      if (ctx.req) {
        const token = await getToken({ req: ctx.req })

        if (token) {
          store.dispatch(
            setSession({
              accessToken: token.accessToken,
              expiry: token.accessTokenExpires,
              client: token.client,
              uid: token.uid,
              role: token.user.role,
            })
          )

          return {
            pageProps: {
              isAdmin: token.user.role === 'admin',
              ...(Component.getInitialProps
                ? await Component.getInitialProps({ ...ctx, store })
                : {}),
            },
          }
        }
      }

      return {
        pageProps: {
          ...(Component.getInitialProps
            ? await Component.getInitialProps({ ...ctx, store })
            : {}),
        },
      }
    }
)

export default appWithTranslation(App)
