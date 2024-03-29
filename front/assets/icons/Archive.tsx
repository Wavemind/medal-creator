/**
 * The external imports
 */
import { Icon } from '@chakra-ui/react'
import { FC } from 'react'

/**
 * The internal imports
 */
import { IconProps } from '@/types'

const ArchiveIcon: FC<IconProps> = props => (
  <Icon viewBox='0 0 16 16' boxSize={props.boxSize || 6} {...props}>
    <path
      fillRule='evenodd'
      clipRule='evenodd'
      d='M7.2929 4.7071L5.5858 3H2V13H14V5H7.5858L7.2929 4.7071ZM2 2H5.5858C5.85102 2 6.10537 2.10536 6.2929 2.2929L8 4H14C14.2652 4 14.5196 4.10536 14.7071 4.29289C14.8946 4.48043 15 4.73478 15 5V13C15 13.2652 14.8946 13.5196 14.7071 13.7071C14.5196 13.8946 14.2652 14 14 14H2C1.73478 14 1.48043 13.8946 1.29289 13.7071C1.10536 13.5196 1 13.2652 1 13V3C1 2.73478 1.10536 2.48043 1.29289 2.29289C1.48043 2.10536 1.73478 2 2 2ZM8.295 7.205L9 6.5L11.5 9L9 11.5L8.295 10.795L9.585 9.5H5V8.5H9.585L8.295 7.205Z'
      fill='currentColor'
    />
  </Icon>
)

export default ArchiveIcon
