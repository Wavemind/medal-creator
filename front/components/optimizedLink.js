/**
 * The external imports
 */
import { Link } from '@chakra-ui/react'
import NextLink from 'next/link'

const OptimizedLink = ({ children, href, ...rest }) => (
  <NextLink href={href} passHref>
    <Link {...rest} style={{ textDecoration: 'none' }}>
      {children}
    </Link>
  </NextLink>
)

export default OptimizedLink
