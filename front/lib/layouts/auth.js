/**
 * The external imports
 */
import { Box } from '@chakra-ui/react'

const AuthLayout = ({ children }) => {
  return (
    <div>
      <Box width='100%' height='92vh'>
        {children}
      </Box>
    </div>
  )
}

export default AuthLayout
