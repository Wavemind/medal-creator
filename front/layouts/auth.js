/**
 * The external imports
 */
import React from 'react'
import { Image, useTheme, Box, Flex } from '@chakra-ui/react'

const AuthLayout = ({ children }) => {
  const { colors } = useTheme()

  return (
    <div>
      <Flex
        bg={colors.primary}
        height="8vh"
        width="100%"
        alignItems="center"
        paddingLeft={5}
      >
        <Image src={'/logo.svg'} alt="logo" height="6vh" />
      </Flex>
      <Box width="100%" height="92vh">
        {children}
      </Box>
    </div>
  )
}

export default AuthLayout
