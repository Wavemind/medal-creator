/**
 * The external imports
 */
import { FC, useRef } from 'react'
import { Controller, useFormContext } from 'react-hook-form'
import {
  Input as ChakraInput,
  FormLabel,
  FormControl,
  FormErrorMessage,
  InputGroup,
  InputLeftElement,
  FormHelperText,
  Icon,
} from '@chakra-ui/react'
import { FiFile } from 'react-icons/fi'

/**
 * The internal imports
 */
import type { BaseInputProps } from '@/types'

/**
 * Type definitions
 */
type FileUploadProps = BaseInputProps & {
  hint: string
  acceptedFileTypes: string
}

const FileUpload: FC<FileUploadProps> = ({
  label,
  name,
  hint,
  acceptedFileTypes,
  isRequired = false,
}) => {
  const {
    control,
    formState: { errors },
  } = useFormContext()
  const inputRef = useRef<HTMLInputElement>(null)

  return (
    <FormControl isInvalid={!!errors[name]} isRequired={isRequired}>
      <FormLabel htmlFor={name}>{label}</FormLabel>
      <Controller
        control={control}
        name={name}
        render={({ field: { value, onChange } }) => (
          <InputGroup>
            <InputLeftElement pointerEvents='none'>
              <Icon as={FiFile} />
            </InputLeftElement>
            <input
              type='file'
              onChange={e => onChange(e.target?.files?.[0])}
              accept={acceptedFileTypes}
              name={name}
              ref={inputRef}
              style={{ display: 'none' }}
            />
            <ChakraInput
              name={name}
              placeholder=''
              onClick={() => inputRef.current?.click()}
              readOnly={true}
              variant=''
              value={(value && value.name) || ''}
            />
          </InputGroup>
        )}
      />

      {hint && <FormHelperText>{hint}</FormHelperText>}

      <FormErrorMessage>{errors[name]?.message as string}</FormErrorMessage>
    </FormControl>
  )
}

export default FileUpload
