/**
 * The external imports
 */
import { FC } from 'react'
import { VStack, Text, useTheme } from '@chakra-ui/react'

/**
 * The internal imports
 */
import { OptimizedLink } from '..'

type SidebarButtonProps = {
  icon: FC
  label: string
  active: boolean
  href: string
}

const SidebarButton: FC<SidebarButtonProps> = ({
  icon,
  label,
  active,
  href,
  ...rest
}) => {
  const { colors, dimensions } = useTheme()

  return (
    <OptimizedLink href={href}>
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
          backgroundColor: colors.sidebarHover,
          borderLeftColor: !active ? colors.sidebarHover : undefined,
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
    </OptimizedLink>
  )
}

export default SidebarButton
