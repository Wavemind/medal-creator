/**
 * The external imports
 */
import { Icon } from '@chakra-ui/react'
import { FC } from 'react'

/**
 * The internal imports
 */
import { IconProps } from '@/types'

const DeleteIcon: FC<IconProps> = props => (
  <Icon viewBox='0 0 16 16' boxSize={props.boxSize || 6} {...props}>
    <path
      fillRule='evenodd'
      clipRule='evenodd'
      d='M6 1H10V2H6V1ZM2 3V4H3V14C3 14.2652 3.10536 14.5196 3.29289 14.7071C3.48043 14.8946 3.73478 15 4 15H12C12.2652 15 12.5196 14.8946 12.7071 14.7071C12.8946 14.5196 13 14.2652 13 14V4H14V3H2ZM4 14V4H12V14H4ZM6 6H7V12H6V6ZM9 6H10V12H9V6Z'
      fill='currentColor'
    />
  </Icon>
)

export default DeleteIcon
