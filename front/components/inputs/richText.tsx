/**
 * The external imports
 */
import { Editor } from '@tinymce/tinymce-react'
import { FormControl, FormErrorMessage } from '@chakra-ui/react'
import { useFormContext, Controller } from 'react-hook-form'
import { ErrorMessage } from '@hookform/error-message'

/**
 * The internal imports
 */
import FormLabel from '@/components/formLabel'
import type { GenericInputComponent } from '@/types'

const RichText: GenericInputComponent = ({ label, name, isRequired }) => {
  const {
    control,
    formState: { errors },
  } = useFormContext()

  return (
    <FormControl isInvalid={!!errors[name]}>
      <FormLabel name={name} isRequired={isRequired}>
        {label}
      </FormLabel>
      <Controller
        control={control}
        name={name}
        render={({ field: { onChange, value } }) => (
          <Editor
            id={`${label}-${name}`}
            tinymceScriptSrc='/tinymce/tinymce.min.js'
            onEditorChange={onChange}
            value={value}
            init={{
              height: 800,
              menubar: false,
              plugins: [
                'advlist',
                'autolink',
                'lists',
                'link',
                'image',
                'charmap',
                'anchor',
                'searchreplace',
                'visualblocks',
                'code',
                'fullscreen',
                'insertdatetime',
                'media',
                'table',
                'preview',
                'help',
                'wordcount',
              ],
              toolbar:
                'undo redo | blocks | ' +
                'bold italic forecolor | alignleft aligncenter ' +
                'alignright alignjustify | bullist numlist outdent indent | ' +
                'removeformat | help',
              content_style:
                'body { font-family:Helvetica,Arial,sans-serif; font-size:14px }',
            }}
          />
        )}
      />

      <ErrorMessage as={<FormErrorMessage />} name={name} errors={errors} />
    </FormControl>
  )
}

export default RichText
