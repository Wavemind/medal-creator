/**
 * The external imports
 */
import { Icon } from '@chakra-ui/react'
import { FC } from 'react'

/**
 * The internal imports
 */
import { IconProps } from '@/types'

const BackIcon: FC<IconProps> = props => (
  <Icon viewBox='0 0 16 16' {...props}>
    <path
      d='M5 8L10 3L10.7 3.7L6.4 8L10.7 12.3L10 13L5 8Z'
      fill='currentColor'
      rotate={90}
    />
  </Icon>
)

export default BackIcon
