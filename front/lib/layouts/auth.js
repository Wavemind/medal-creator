/**
 * The external imports
 */
import { Box } from '@chakra-ui/react'

const AuthLayout = ({ children }) => {
  return (
    <Box width='100%' height='92vh'>
      {children}
    </Box>
  )
}

export default AuthLayout
