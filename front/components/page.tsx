/**
 * The external imports
 */
import { FC, ReactNode } from 'react'
import { Box } from '@chakra-ui/react'
import Head from 'next/head'

/**
 * Type definitions
 */
interface Props {
  children: ReactNode
  title: string
}

const Page: FC<Props> = ({ children, title }) => (
  <div>
    <Head>
      <title>{title}</title>
      <meta name='viewport' content='initial-scale=1.0, width=device-width' />
    </Head>
    <Box>{children}</Box>
  </div>
)

export default Page
