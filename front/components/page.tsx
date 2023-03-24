/**
 * The external imports
 */
import { Box } from '@chakra-ui/react'
import Head from 'next/head'

/**
 * The interal imports
 */
import type { PageComponent } from '@/types'

const Page: PageComponent = ({ children, title }) => (
  <div>
    <Head>
      <title>{title}</title>
      <meta name='viewport' content='initial-scale=1.0, width=device-width' />
    </Head>
    <Box>{children}</Box>
  </div>
)

export default Page
