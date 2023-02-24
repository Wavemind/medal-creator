/**
 * The external imports
 */
import { FC } from 'react'
import {
  FormLabel,
  FormControl,
  PinInput,
  PinInputField,
  HStack,
  Box,
} from '@chakra-ui/react'

/**
 * The internal imports
 */
import type { BaseInputProps } from '@/types/input'

/**
 * Type definitions
 */
type PinProps = BaseInputProps & {
  onComplete: (value: string) => void
}

const Pin: FC<PinProps> = ({ name, label, onComplete }) => (
  <FormControl>
    <FormLabel textAlign='center' w='full' htmlFor={name}>
      {label}
    </FormLabel>
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
