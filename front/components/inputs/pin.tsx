/**
 * The external imports
 */
import {
  FormControl,
  PinInput,
  PinInputField,
  HStack,
  Box,
} from '@chakra-ui/react'

/**
 * The internal imports
 */
import type { PinComponent } from '@/types'

const Pin: PinComponent = ({ onComplete }) => (
  <FormControl>
    <HStack justifyContent='center'>
      <PinInput onComplete={onComplete} autoFocus otp>
        <PinInputField />
        <PinInputField />
        <PinInputField />
        <Box w={3} border='none' />
        <PinInputField />
        <PinInputField />
        <PinInputField />
      </PinInput>
    </HStack>
  </FormControl>
)

export default Pin
