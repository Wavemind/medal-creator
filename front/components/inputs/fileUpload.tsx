/**
 * The external imports
 */
import { useRef } from 'react'
import { Controller, useFormContext } from 'react-hook-form'
import {
  Input as ChakraInput,
  FormControl,
  FormErrorMessage,
  InputGroup,
  InputLeftElement,
  FormHelperText,
  Icon,
} from '@chakra-ui/react'
import { File } from 'lucide-react'
import { ErrorMessage } from '@hookform/error-message'

/**
 * The internal imports
 */
import FormLabel from '@/components/formLabel'
import type { FileUploadComponent } from '@/types'

const FileUpload: FileUploadComponent = ({
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
    <FormControl isInvalid={!!errors[name]}>
      <FormLabel name={name} isRequired={isRequired}>
        {label}
      </FormLabel>
      <Controller
        control={control}
        name={name}
        render={({ field: { value, onChange } }) => (
          <InputGroup>
            <InputLeftElement pointerEvents='none'>
              <Icon as={File} />
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

      <ErrorMessage as={<FormErrorMessage />} name={name} errors={errors} />
    </FormControl>
  )
}

export default FileUpload
