/**
 * The external imports
 */
import { Icon } from '@chakra-ui/react'
import { FC } from 'react'

/**
 * The internal imports
 */
import { IconProps } from '@/types'

const ShowMoreIcon: FC<IconProps> = props => (
  <Icon
    viewBox='0 0 16 16'
    boxSize={props.boxSize || 3}
    transform='rotate(-90deg)'
    {...props}
  >
    <path
      d='M5 8L10 3L10.7 3.7L6.4 8L10.7 12.3L10 13L5 8Z'
      fill='currentColor'
    />
  </Icon>
)

export default ShowMoreIcon
