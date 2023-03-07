/**
 * The external imports
 */
import { Icon } from '@chakra-ui/react'
import { FC } from 'react'

/**
 * The internal imports
 */
import { IconProps } from '@/types'

const LibraryIcon: FC<IconProps> = props => (
  <Icon viewBox='0 0 33 25' fill='none' {...props}>
    <rect x='0.75' y='0.75' width='22.5' height='15.5' />
    <path
      d='M2 0.5H22C22.8284 0.5 23.5 1.17157 23.5 2V15C23.5 15.8284 22.8284 16.5 22 16.5H2C1.17157 16.5 0.5 15.8284 0.5 15V2C0.5 1.17157 1.17157 0.5 2 0.5Z'
      stroke='currentColor'
    />
    <path
      d='M0 2C0 0.895432 0.895431 0 2 0H22C23.1046 0 24 0.895431 24 2V4.02632H0V2Z'
      fill='currentColor'
    />
    <rect x='0.75' y='0.75' width='22.5' height='15.5' strokeWidth='1.5' />
    <rect
      width='24'
      height='17'
      transform='translate(9 8)'
      fill='transparent'
    />
    <path
      d='M11 8.5H31C31.8284 8.5 32.5 9.17157 32.5 10V23C32.5 23.8284 31.8284 24.5 31 24.5H11C10.1716 24.5 9.5 23.8284 9.5 23V10C9.5 9.17157 10.1716 8.5 11 8.5Z'
      stroke='currentColor'
    />
    <path
      d='M9 10C9 8.89543 9.89543 8 11 8H31C32.1046 8 33 8.89543 33 10V12.0263H9V10Z'
      fill='currentColor'
    />
  </Icon>
)

export default LibraryIcon
