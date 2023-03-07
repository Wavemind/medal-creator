/**
 * The external imports
 */
import { FC } from 'react'
import {
  FormControl,
  PinInput,
  PinInputField,
  HStack,
  Box,
} from '@chakra-ui/react'

/**
 * Type definitions
 */
type PinProps = {
  onComplete: (value: string) => void
}

const Pin: FC<PinProps> = ({ onComplete }) => (
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
