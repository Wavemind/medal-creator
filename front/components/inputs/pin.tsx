/**
 * The external imports
 */
import { FC } from 'react'
import { Controller, useFormContext } from 'react-hook-form'
import {
  FormLabel,
  FormControl,
  FormErrorMessage,
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

const Pin: FC<PinProps> = ({ name, label, onComplete }) => {
  const {
    control,
    formState: { errors },
  } = useFormContext()

  return (
    <FormControl isInvalid={!!errors[name]}>
      <FormLabel htmlFor={name}>{label}</FormLabel>
      <Controller
        control={control}
        name={name}
        render={({ field: { value, onChange } }) => (
          <HStack>
            <PinInput value={value} onChange={onChange} onComplete={onComplete}>
              <PinInputField />
              <PinInputField />
              <PinInputField />
              <Box w={3} border='none' />
              <PinInputField />
              <PinInputField />
              <PinInputField />
            </PinInput>
          </HStack>
        )}
      />

      <FormErrorMessage>{errors[name]?.message as string}</FormErrorMessage>
    </FormControl>
  )
}

export default Pin
