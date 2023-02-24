/**
 * The external imports
 */
import { FC, ReactNode } from 'react'
import { Box } from '@chakra-ui/react'
import Head from 'next/head'

/**
 * Type definitions
 */
type PageProps = {
  children: ReactNode
  title: string
}

const Page: FC<PageProps> = ({ children, title }) => (
  <div>
    <Head>
      <title>{title}</title>
      <meta name='viewport' content='initial-scale=1.0, width=device-width' />
    </Head>
    <Box>{children}</Box>
  </div>
)

export default Page
