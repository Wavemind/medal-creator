/**
 * The external imports
 */
import dynamic from 'next/dynamic'
import {
  FormLabel,
  FormControl,
  FormErrorMessage,
  Spinner,
  useConst,
} from '@chakra-ui/react'
import { useFormContext, Controller } from 'react-hook-form'

const QuillNoSSRWrapper = dynamic(import('react-quill'), {
  ssr: false,
  loading: () => <Spinner />,
})

const RichText = ({ label, name, isRequired }) => {
  const {
    control,
    formState: { errors },
  } = useFormContext()

  /*
   * Quill editor formats
   * See https://quilljs.com/docs/formats/
   */
  const formats = useConst(() => [
    'header',
    'font',
    'size',
    'bold',
    'italic',
    'underline',
    'strike',
    'blockquote',
    'list',
    'bullet',
    'indent',
    'link',
    'image',
  ])

  const modules = useConst(() => ({
    toolbar: [
      [{ header: '1' }, { header: '2' }, { font: [] }],
      [{ size: [] }],
      ['bold', 'italic', 'underline', 'strike', 'blockquote'],
      [
        { list: 'ordered' },
        { list: 'bullet' },
        { indent: '-1' },
        { indent: '+1' },
      ],
      ['link', 'image', 'video'],
      ['clean'],
    ],
    clipboard: {
      // toggle to add extra line breaks when pasting HTML:
      matchVisual: false,
    },
  }))

  return (
    <FormControl isInvalid={errors[name]} isRequired={isRequired}>
      <FormLabel htmlFor={name}>{label}</FormLabel>
      <Controller
        control={control}
        name={name}
        theme='snow'
        render={({ field: { onChange, value } }) => (
          <QuillNoSSRWrapper
            value={value}
            onChange={onChange}
            modules={modules}
            formats={formats}
            style={{
              height: 800,
            }}
          />
        )}
      />

      <FormErrorMessage>
        {errors[name] && errors[name].message}
      </FormErrorMessage>
    </FormControl>
  )
}

export default RichText
