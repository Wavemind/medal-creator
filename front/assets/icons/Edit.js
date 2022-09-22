/**
 * The external imports
 */
import { Icon } from '@chakra-ui/react'

const EditIcon = props => (
  <Icon viewBox="0 0 16 16" boxSize={props.boxSize || 6} {...props}>
    <path
      fillRule="evenodd"
      clipRule="evenodd"
      d="M10.9 1.3L12.7 3.1C13.1 3.5 13.1 4.1 12.7 4.5L5.2 12H2V8.8L9.5 1.3C9.9 0.9 10.5 0.9 10.9 1.3ZM12 3.8L10.2 2L8.7 3.5L10.5 5.3L12 3.8ZM3 9.2V11H4.8L9.8 6L8 4.2L3 9.2ZM1 14V13H15V14H1Z"
      fill="currentColor"
    />
  </Icon>
)

export default EditIcon
