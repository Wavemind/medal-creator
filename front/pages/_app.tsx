/**
 * The external imports
 */
import { useMemo, useState } from 'react'
import dynamic from 'next/dynamic'
import { Provider } from 'react-redux'
import { appWithTranslation } from 'next-i18next'
import { ErrorBoundary } from 'react-error-boundary'
import { SessionProvider } from 'next-auth/react'
import { getToken } from 'next-auth/jwt'
const ChakraProvider = dynamic(() =>
  import('@chakra-ui/provider').then(mod => mod.ChakraProvider)
)
import type { NextApiRequest } from 'next'

/**
 * The internal imports
 */
import theme from '@/lib/theme'
import Layout from '@/lib/layouts/default'
import { wrapper } from '@/lib/store'
import { setSession } from '@/lib/store/session'
import AppErrorFallback from '@/components/appErrorFallback'
import { isAdminOrClinician } from '@/lib/utils/access'
import { ComponentStackProps, AppWithLayoutPage, RoleEnum } from '@/types'

import '@/styles/globals.scss'
import '@/styles/diagram.scss'

function App({ Component, ...rest }: AppWithLayoutPage) {
  const { store, props } = wrapper.useWrappedStore(rest)
  const { pageProps } = props
  // ReactErrorBoundary doesn't pass in the component stack trace.
  // Capture that ourselves to pass down via render props
  const [errorInfo, setErrorInfo] = useState<ComponentStackProps>(null)

  const getLayout = useMemo(
    () =>
      Component.getLayout ||
      ((page: React.ReactNode) => <Layout>{page}</Layout>),
    [Component.getLayout]
  )

  return (
    <SessionProvider session={pageProps.session}>
      <Provider store={store}>
        <ChakraProvider theme={theme}>
          <ErrorBoundary
            onError={(_error: Error, info: { componentStack: string }) => {
              setErrorInfo(info)
            }}
            fallbackRender={fallbackProps => (
              <AppErrorFallback {...fallbackProps} errorInfo={errorInfo} />
            )}
          >
            {getLayout(<Component {...pageProps} />)}
          </ErrorBoundary>
        </ChakraProvider>
      </Provider>
    </SessionProvider>
  )
}

App.getInitialProps = wrapper.getInitialAppProps(
  store =>
    async ({ ctx, Component }) => {
      if (ctx.req) {
        const token = await getToken({ req: ctx.req as NextApiRequest })

        if (token) {
          store.dispatch(
            setSession({
              accessToken: token.accessToken,
              expiry: token.expiry,
              client: token.client,
              uid: token.uid,
              role: token.user.role,
            })
          )

          return {
            pageProps: {
              isAdmin: token.user.role === RoleEnum.Admin,
              isAdminOrClinician: isAdminOrClinician(token.user.role),
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
