/**
 * The external imports
 */
import React from 'react'
import { Box, ChakraProvider } from '@chakra-ui/react'
import { createStandaloneToast } from '@chakra-ui/toast'
import { appWithTranslation } from 'next-i18next'
import { Provider } from 'react-redux'
import { PersistGate } from 'redux-persist/lib/integration/react'
import { motion, AnimatePresence } from "framer-motion"
import { useRouter } from "next/router"

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
import { store, persistor } from '/lib/store'

function App({ Component, pageProps }) {
  const router = useRouter();
  const { ToastContainer } = createStandaloneToast()
  const getLayout = Component.getLayout || (page => <Layout>{page}</Layout>)

  return (
    <Provider store={store}>
      <PersistGate loading={null} persistor={persistor}>
        <ChakraProvider theme={theme}>
          <AnimatePresence exitBeforeEnter>
            <Box
              as={motion.div}
              key={router.route}
              initial="initialState"
              animate="animateState"
              exit="exitState"
              w="100%"
              minH="100vh"
              transition={{
                duration: 0.75,
              }}
              variants={{
                initialState: {
                  opacity: 0,
                  clipPath: "polygon(0 0, 100% 0, 100% 100%, 0% 100%)",
                },
                animateState: {
                  opacity: 1,
                  clipPath: "polygon(0 0, 100% 0, 100% 100%, 0% 100%)",
                },
                exitState: {
                  clipPath: "polygon(50% 0, 50% 0, 50% 100%, 50% 100%)",
                },
              }}
            >
              {getLayout(<Component {...pageProps} />)}
            </Box>
          </AnimatePresence>
          <ToastContainer />
        </ChakraProvider>
      </PersistGate>
    </Provider>
  )
}

export default appWithTranslation(App)
