/**
 * The external imports
 */
import Head from 'next/head'

/**
 * The interal imports
 */
import type { PageComponent } from '@/types'
import React from 'react'

const Page: PageComponent = ({ children, title }) => (
  <React.Fragment>
    <Head>
      <title>{title}</title>
      <meta name='viewport' content='initial-scale=1.0, width=device-width' />
    </Head>
    {children}
  </React.Fragment>
)

export default Page
