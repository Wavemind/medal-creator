/**
 * The external imports
 */
import { Button } from '@chakra-ui/react'
import { Link } from '@chakra-ui/next-js'

/**
 * The internal imports
 */
import type { DiagramButtonComponent } from '@/types'

const DiagramButton: DiagramButtonComponent = ({
  href,
  label,
  isDisabled = false,
}) => (
  <Button as={Link} href={href} target='_blank' isDisabled={isDisabled}>
    {label}
  </Button>
)

export default DiagramButton
