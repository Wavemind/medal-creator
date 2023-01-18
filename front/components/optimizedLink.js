/**
 * The external imports
 */
import NextLink from 'next/link'
import { Link } from '@chakra-ui/react'

const OptimizedLink = ({ children, href, ...rest }) => (
  <Link as={NextLink} href={href} {...rest} style={{ textDecoration: 'none' }}>
    {children}
  </Link>
)

export default OptimizedLink
