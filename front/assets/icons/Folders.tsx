/**
 * The external imports
 */
import { Icon } from '@chakra-ui/react'
import { FC } from 'react'

/**
 * The internal imports
 */
import { IconProps } from '@/types'

const FoldersIcon: FC<IconProps> = props => (
  <Icon viewBox='0 0 16 16' {...props}>
    <path
      fillRule='evenodd'
      clipRule='evenodd'
      d='M8.83325 4.5H14V3.5H9.16675L7.4336 2.2C7.26021 2.07049 7.04967 2.00035 6.83325 2H3V3H6.83325L8.83325 4.5ZM3 14H13C13.2651 13.9997 13.5193 13.8943 13.7068 13.7068C13.8943 13.5193 13.9997 13.2651 14 13V7C13.9997 6.73487 13.8943 6.48068 13.7068 6.2932C13.5193 6.10572 13.2651 6.00028 13 6H8.16675L6.4336 4.7C6.26021 4.57049 6.04967 4.50035 5.83325 4.5H3C2.73487 4.50028 2.48068 4.60572 2.2932 4.7932C2.10572 4.98068 2.00028 5.23487 2 5.5V13C2.00028 13.2651 2.10572 13.5193 2.2932 13.7068C2.48068 13.8943 2.73487 13.9997 3 14ZM2.99925 5.5H5.83325L7.83325 7H13V13H3L2.99925 5.5Z'
      fill='currentColor'
    />
  </Icon>
)

export default FoldersIcon
