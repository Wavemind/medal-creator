/**
 * The external imports
 */
import { Icon } from '@chakra-ui/react'
import { FC } from 'react'

/**
 * The internal imports
 */
import { IconProps } from '@/types'

const CheckIcon: FC<IconProps> = props => (
  <Icon viewBox='0 0 16 16' {...props}>
    <path
      d='M6.5 12L2 7.49997L2.707 6.79297L6.5 10.5855L13.293 3.79297L14 4.49997L6.5 12Z'
      fill='currentColor'
    />
  </Icon>
)

export default CheckIcon
