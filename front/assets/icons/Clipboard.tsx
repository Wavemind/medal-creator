/**
 * The external imports
 */
import { Icon } from '@chakra-ui/react'
import { FC } from 'react'

/**
 * The internal imports
 */
import { IconProps } from '@/types'

const ClipboardIcon: FC<IconProps> = props => (
  <Icon viewBox='0 0 13 16' {...props}>
    <path
      d='M6.5 0.78125C5.75306 0.78125 5.22225 1.30969 4.95981 1.96875H0.5625V15.625H12.4375V1.96875H8.04019C7.77775 1.30969 7.24694 0.78125 6.5 0.78125ZM6.5 1.96875C6.82953 1.96875 7.09375 2.23297 7.09375 2.5625V3.15625H8.875V4.34375H4.125V3.15625H5.90625V2.5625C5.90625 2.23297 6.17047 1.96875 6.5 1.96875ZM1.75 3.15625H2.9375V5.53125H10.0625V3.15625H11.25V14.4375H1.75V3.15625ZM5.90625 7.3125V9.09375H4.125V10.2812H5.90625V12.0625H7.09375V10.2812H8.875V9.09375H7.09375V7.3125H5.90625Z'
      fill='currentColor'
    />
  </Icon>
)

export default ClipboardIcon
