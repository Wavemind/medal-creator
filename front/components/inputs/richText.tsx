/**
 * The external imports
 */
import { FC, useRef } from 'react'
import { Editor } from '@tinymce/tinymce-react'
import { FormLabel, FormControl, FormErrorMessage } from '@chakra-ui/react'
import { useFormContext, Controller } from 'react-hook-form'

/**
 * Type imports
 */
import { BaseInputProps } from '@/types/input'

const RichText: FC<BaseInputProps> = ({ label, name, isRequired }) => {
  const {
    control,
    formState: { errors },
  } = useFormContext()

  // TODO : Check if we need the ref element. It doesn't seem to appear in the docs
  const editorRef = useRef<any>(null)

  return (
    <FormControl isInvalid={!!errors[name]} isRequired={isRequired}>
      <FormLabel htmlFor={name}>{label}</FormLabel>
      <Controller
        control={control}
        name={name}
        render={({ field: { onChange, value } }) => (
          <Editor
            id={`${label}-${name}`}
            tinymceScriptSrc='/tinymce/tinymce.min.js'
            onInit={(evt, editor) => (editorRef.current = editor)}
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

      <FormErrorMessage>
        {errors[name]?.message as string}
      </FormErrorMessage>
    </FormControl>
  )
}

export default RichText
