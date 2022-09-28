/**
 * The external imports
 */
import { Box } from '@chakra-ui/react'
import Head from 'next/head'

const Page = ({ children, title }) => (
  <div>
    <Head>
      <title>{title}</title>
      <meta name='viewport' content='initial-scale=1.0, width=device-width' />
    </Head>
    <Box>{children}</Box>
  </div>
)

export default Page
