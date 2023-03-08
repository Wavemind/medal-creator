/**
 * The external imports
 */
import { Icon } from '@chakra-ui/react'
import { FC } from 'react'

/**
 * The internal imports
 */
import { IconProps } from '@/types'

const WarningIcon: FC<IconProps> = props => (
  <Icon viewBox='0 0 16 16' {...props}>
    <path
      fillRule='evenodd'
      clipRule='evenodd'
      d='M1.25478 14.9357C1.32965 14.9779 1.4141 15 1.5 15H14.5C14.5859 15 14.6704 14.9779 14.7452 14.9357C14.8201 14.8936 14.8828 14.8329 14.9274 14.7595C14.972 14.686 14.9969 14.6024 14.9997 14.5165C15.0026 14.4307 14.9832 14.3455 14.9436 14.2693L8.4436 1.76931C8.40138 1.68812 8.3377 1.62008 8.25948 1.5726C8.18126 1.52511 8.09151 1.5 8 1.5C7.9085 1.5 7.81875 1.52511 7.74053 1.5726C7.66231 1.62008 7.59862 1.68812 7.5564 1.76931L1.0564 14.2693C1.01677 14.3455 0.997436 14.4307 1.00027 14.5165C1.00311 14.6024 1.02802 14.686 1.0726 14.7595C1.11718 14.8329 1.17992 14.8936 1.25478 14.9357ZM13.6757 13.9984L13.6747 14H2.32535L2.32435 13.9984L7.999 3.08571H8.001L13.6757 13.9984ZM8.5 6H7.5V10.5H8.5V6ZM8 11.5C7.85166 11.5 7.70666 11.544 7.58332 11.6264C7.45999 11.7088 7.36386 11.8259 7.30709 11.963C7.25033 12.1 7.23547 12.2508 7.26441 12.3963C7.29335 12.5418 7.36478 12.6754 7.46967 12.7803C7.57456 12.8852 7.7082 12.9566 7.85368 12.9856C7.99917 13.0145 8.14997 12.9997 8.28701 12.9429C8.42406 12.8861 8.54119 12.79 8.6236 12.6667C8.70601 12.5433 8.75 12.3983 8.75 12.25C8.75 12.0511 8.67098 11.8603 8.53033 11.7197C8.38968 11.579 8.19891 11.5 8 11.5Z'
      fill='currentColor'
    />
  </Icon>
)

export default WarningIcon