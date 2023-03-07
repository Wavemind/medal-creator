/**
 * The external imports
 */
import { Icon } from '@chakra-ui/react'
import { FC } from 'react'

/**
 * The internal imports
 */
import { IconProps } from '@/types'

const AlgorithmsIcon: FC<IconProps> = props => (
  <Icon viewBox='0 0 35 30' fill='none' {...props}>
    <rect width='15' height='11' transform='translate(10)' />
    <path
      d='M12 0.5H23C23.8284 0.5 24.5 1.17157 24.5 2V9C24.5 9.82843 23.8284 10.5 23 10.5H12C11.1716 10.5 10.5 9.82843 10.5 9V2C10.5 1.17157 11.1716 0.5 12 0.5Z'
      stroke='currentColor'
    />
    <path
      d='M10 2C10 0.895431 10.8954 0 12 0H23C24.1046 0 25 0.895431 25 2V2.60526H10V2Z'
      fill='currentColor'
    />
    <rect width='15' height='11' transform='translate(0 19)' />
    <path
      d='M2 19.5H13C13.8284 19.5 14.5 20.1716 14.5 21V28C14.5 28.8284 13.8284 29.5 13 29.5H2C1.17157 29.5 0.5 28.8284 0.5 28V21C0.5 20.1716 1.17157 19.5 2 19.5Z'
      stroke='currentColor'
    />
    <path
      d='M0 21C0 19.8954 0.895431 19 2 19H13C14.1046 19 15 19.8954 15 21V21.6053H0V21Z'
      fill='currentColor'
    />
    <rect width='15' height='11' transform='translate(20 19)' />
    <path
      d='M22 19.5H33C33.8284 19.5 34.5 20.1716 34.5 21V28C34.5 28.8284 33.8284 29.5 33 29.5H22C21.1716 29.5 20.5 28.8284 20.5 28V21C20.5 20.1716 21.1716 19.5 22 19.5Z'
      stroke='currentColor'
    />
    <path
      d='M20 21C20 19.8954 20.8954 19 22 19H33C34.1046 19 35 19.8954 35 21V21.6053H20V21Z'
      fill='currentColor'
    />
    <path
      d='M16.8822 12L16.8822 14.4975L8.85296 14.4975C7.83134 14.4975 7 15.0578 7 15.7462L7 17.8274C7 18.0575 8.23519 18.0575 8.23519 17.8274L8.23519 15.7462C8.23519 15.5171 8.51219 15.3299 8.85296 15.3299L26.147 15.3299C26.4878 15.3299 26.7648 15.5168 26.7648 15.7462L26.7648 17.8274C26.7648 18.0575 28 18.0575 28 17.8274L28 15.7462C28 15.0578 27.169 14.4975 26.147 14.4975L18.1178 14.4975L18.1178 12'
      fill='currentColor'
    />
  </Icon>
)

export default AlgorithmsIcon
