/**
 * The external imports
 */
import { Icon } from '@chakra-ui/react'

const SortIcon = props => (
  <Icon viewBox='0 0 16 16' boxSize={props.boxSize || 6} {...props}>
    <path
      d='M9 11L9.707 10.293L11.5 12.086V2H12.5V12.086L14.293 10.293L15 11L12 14L9 11Z'
      fill='currentColor'
    />
    <path d='M8 9H1V10H8V9Z' fill='currentColor' />
    <path d='M8 6H3V7H8V6Z' fill='currentColor' />
    <path d='M8 3H5V4H8V3Z' fill='currentColor' />
  </Icon>
)

export default SortIcon
