/**
 * The external imports
 */

import { VStack, Text, useTheme } from '@chakra-ui/react'
import { Link } from '@chakra-ui/next-js'

/**
 * The internal imports
 */
import type { SidebarButtonComponent } from '@/types'

const SidebarButton: SidebarButtonComponent = ({
  icon,
  label,
  active,
  href,
  isDisabled,
  ...rest
}) => {
  const { colors, dimensions } = useTheme()

  if (isDisabled) {
    return (
      <VStack
        width={dimensions.sidebarWidth}
        paddingTop={2}
        paddingBottom={2}
        justifyContent='center'
        borderLeftColor={colors.sidebar}
        borderLeftWidth={4}
        borderLeftStyle='solid'
        cursor='not-allowed'
        {...rest}
      >
        {icon({ color: active ? colors.secondary : undefined })}
        <Text
          fontSize={10}
          color={colors.primary}
          fontWeight='normal'
          textAlign='center'
        >
          {label}
        </Text>
      </VStack>
    )
  }

  return (
    <Link href={href}>
      <VStack
        width={dimensions.sidebarWidth}
        paddingTop={2}
        paddingBottom={2}
        justifyContent='center'
        borderLeftColor={active ? colors.secondary : colors.sidebar}
        borderLeftWidth={4}
        borderLeftStyle='solid'
        cursor='pointer'
        _hover={{
          backgroundColor: colors.subMenu,
          borderLeftColor: !active ? colors.subMenu : undefined,
        }}
        {...rest}
      >
        {icon({ color: active ? colors.secondary : undefined })}
        <Text
          fontSize={10}
          color={active ? colors.secondary : colors.primary}
          fontWeight={active ? 'bold' : 'normal'}
          textAlign='center'
        >
          {label}
        </Text>
      </VStack>
    </Link>
  )
}

export default SidebarButton
