/**
 * The external imports
 */
import { FormLabel as ChakraFormLabel, Text } from '@chakra-ui/react'

/**
 * The internal imports
 */
import type { FormLabelComponent } from '@/types'

const FormLabel: FormLabelComponent = ({ children, isRequired, name }) => (
  <ChakraFormLabel htmlFor={name}>
    {children}{' '}
    {isRequired && (
      <Text as='span' color='secondary'>
        *
      </Text>
    )}
  </ChakraFormLabel>
)

export default FormLabel
