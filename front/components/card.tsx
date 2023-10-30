/**
 * The external imports
 */
import { Box } from '@chakra-ui/react'

/**
 * The internal imports
 */
import type { CardComponent } from '@/types'

const Card: CardComponent = ({ children, ...rest }) => (
  <Box
    w='full'
    boxShadow='0px 0px 4px rgba(0, 0, 0, 0.15)'
    border={1}
    borderColor='sidebar'
    borderRadius='lg'
    {...rest}
  >
    {children}
  </Box>
)

export default Card
