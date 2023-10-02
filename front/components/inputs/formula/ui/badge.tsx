/**
 * The external imports
 */
import React, { FC, PropsWithChildren } from 'react'
import { Tag, TagLabel } from '@chakra-ui/react'

const Badge: FC<PropsWithChildren<{ isFunction?: boolean }>> = ({
  children,
  isFunction = false,
}) => {
  return (
    <Tag borderRadius='full' colorScheme={isFunction ? 'blue' : 'green'}>
      <TagLabel>{children}</TagLabel>
    </Tag>
  )
}

export default Badge
