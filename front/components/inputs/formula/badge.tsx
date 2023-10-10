/**
 * The external imports
 */
import { Tag, TagLabel, useTheme } from '@chakra-ui/react'

/**
 * The internal imports
 */
import type { BadgeComponent } from '@/types'

const Badge: BadgeComponent = ({ children, isFunction = false }) => {
  const {
    colors: { formula },
  } = useTheme()

  return (
    <Tag
      borderRadius='full'
      colorScheme={isFunction ? formula.function : formula.variable}
    >
      <TagLabel>{children}</TagLabel>
    </Tag>
  )
}

export default Badge
