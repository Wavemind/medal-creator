/**
 * The external imports
 */
import { FC } from 'react'
import NextLink from 'next/link'
import { Link } from '@chakra-ui/react'
import type { LinkProps as NextJSLinkProps } from 'next/link'
import type { LinkProps as ChakraLinkProps } from '@chakra-ui/react'

const OptimizedLink: FC<NextJSLinkProps & ChakraLinkProps> = ({
  children,
  href,
  ...rest
}) => (
  <Link as={NextLink} href={href} {...rest} style={{ textDecoration: 'none' }}>
    {children}
  </Link>
)

export default OptimizedLink
