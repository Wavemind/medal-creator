/**
 * The external imports
 */
import React, { FC, PropsWithChildren } from 'react'
import { Tag, TagCloseButton, TagLabel } from '@chakra-ui/react'

/**
 * The internal imports
 */
import { useFormula } from '@/lib/hooks/useFormula'

const Badge: FC<PropsWithChildren<{ isFunction?: boolean }>> = ({
  children,
  isFunction = false,
}) => {
  const { inputValue, setInputValue, inputRef } = useFormula()

  const handleBadgeRemove = () => {
    console.log('remove badge')
  }

  return (
    <Tag borderRadius='full' colorScheme={isFunction ? 'purple' : 'blackAlpha'}>
      <TagLabel>{children}</TagLabel>
      <TagCloseButton onClick={handleBadgeRemove} />
    </Tag>
  )
}

export default Badge
