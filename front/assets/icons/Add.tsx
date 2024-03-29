/**
 * The external imports
 */
import { Icon } from '@chakra-ui/react'
import { FC } from 'react'

/**
 * The internal imports
 */
import { IconProps } from '@/types'

const AddIcon: FC<IconProps> = props => (
  <Icon viewBox='0 0 16 16' transform='rotate(45deg)' {...props}>
    <path
      d='M12 4.7L11.3 4L8 7.3L4.7 4L4 4.7L7.3 8L4 11.3L4.7 12L8 8.7L11.3 12L12 11.3L8.7 8L12 4.7Z'
      fill='currentColor'
    />
  </Icon>
)

export default AddIcon
