/**
 * The external imports
 */
import { Icon } from '@chakra-ui/react'
import { FC } from 'react'

/**
 * The internal imports
 */
import { IconProps } from '@/types'

const FilterIcon: FC<IconProps> = props => (
  <Icon viewBox='0 0 16 16' boxSize={props.boxSize || 6} {...props}>
    <path
      d='M9 14H7C6.73478 14 6.48043 13.8946 6.29289 13.7071C6.10536 13.5196 6 13.2652 6 13V9.205L2.295 5.5C2.10721 5.31332 2.00112 5.05979 2 4.795V3C2 2.73478 2.10536 2.48043 2.29289 2.29289C2.48043 2.10536 2.73478 2 3 2H13C13.2652 2 13.5196 2.10536 13.7071 2.29289C13.8946 2.48043 14 2.73478 14 3V4.795C13.9989 5.05979 13.8928 5.31332 13.705 5.5L10 9.205V13C10 13.2652 9.89464 13.5196 9.70711 13.7071C9.51957 13.8946 9.26522 14 9 14ZM3 3V4.795L7 8.795V13H9V8.795L13 4.795V3H3Z'
      fill='currentColor'
    />
  </Icon>
)

export default FilterIcon
