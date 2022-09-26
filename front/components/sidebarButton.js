/**
 * The external imports
 */
import React from 'react'
import { VStack, Text, useTheme } from '@chakra-ui/react'

/**
 * The internal imports
 */

const SidebarButton = ({ icon, label, handleClick, active }) => {
  const { colors, dimensions } = useTheme()

  return (
    <VStack
      onClick={active ? null : handleClick}
      width={dimensions.sidebarWidth}
      paddingTop={2}
      paddingBottom={2}
      justifyContent='center'
      borderLeftColor={active ? colors.secondary : colors.sidebar}
      borderLeftWidth={4}
      borderLeftStyle='solid'
      cursor='pointer'
      _hover={{
        backgroundColor: colors.sidebarHover,
        borderLeftColor: !active && colors.sidebarHover,
      }}
    >
      {icon({ color: active && colors.secondary })}
      <Text
        fontSize='xs'
        color={active ? colors.secondary : colors.primary}
        fontWeight={active ? 'bold' : 'normal'}
        textAlign='center'
      >
        {label}
      </Text>
    </VStack>
  )
}

export default SidebarButton
