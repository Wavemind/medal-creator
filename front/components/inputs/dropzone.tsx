/**
 * The external imports
 */
import { Dispatch, FC, SetStateAction, useCallback, useMemo } from 'react'
import { AiOutlineFileAdd, AiOutlineFile } from 'react-icons/ai'
import { Accept, useDropzone } from 'react-dropzone'
import { useTranslation } from 'next-i18next'
import {
  FormLabel,
  Icon,
  Center,
  HStack,
  Text,
  IconButton,
  Box,
  FormHelperText,
  FormControl,
} from '@chakra-ui/react'

/**
 * The internal imports
 */
import { DeleteIcon } from '@/assets/icons'
import type { BaseInputProps } from '@/types/input'
import { MediaType } from '@/types'

/**
 * Type definitions
 */
type DropzoneProps = BaseInputProps & {
  multiple: boolean
  acceptedFileTypes: Accept
  filesToUpload: File[]
  setFilesToUpload: Dispatch<SetStateAction<File[]>>
  existingFiles: MediaType[]
  setExistingFilesToRemove: Dispatch<SetStateAction<number[]>>
  existingFilesToRemove: number[]
}

const Dropzone: FC<DropzoneProps> = ({
  label,
  name,
  multiple,
  acceptedFileTypes,
  filesToUpload,
  setFilesToUpload,
  existingFiles,
  setExistingFilesToRemove,
  existingFilesToRemove,
}) => {
  const { t } = useTranslation('diagnoses')

  // Callback to add the accepted files to list of attached files
  const onDrop = useCallback((acceptedFiles: File[]) => {
    setFilesToUpload(prev => [...prev, ...acceptedFiles])
  }, [])

  const displayableExistingFiles = useMemo(
    () =>
      existingFiles.filter(
        file => !existingFilesToRemove.includes(Number(file.id))
      ),
    [existingFilesToRemove, existingFiles]
  )

  const {
    getRootProps,
    getInputProps,
    isDragActive,
    isDragReject,
    isDragAccept,
    fileRejections,
  } = useDropzone({
    onDrop,
    multiple: multiple,
    accept: acceptedFileTypes,
  })

  // Removes the file from the list of attached files
  const handleFileRemove = (index: number) => {
    setFilesToUpload(prev => {
      const newFiles = [...prev]
      newFiles.splice(index, 1)
      return newFiles
    })
  }

  return (
    <FormControl>
      <FormLabel htmlFor={name}>{label}</FormLabel>
      <Center
        p={10}
        cursor='pointer'
        bg={isDragActive ? 'gray.100' : 'transparent'}
        _hover={{ bg: 'gray.100' }}
        transition='background-color 0.2s ease'
        borderRadius={4}
        border='3px dashed'
        borderColor={
          isDragAccept ? 'success' : isDragReject ? 'error' : 'gray.300'
        }
        {...getRootProps()}
      >
        <input {...getInputProps()} />
        <Icon as={AiOutlineFileAdd} mr={4} h={6} w={6} />
        <Text textAlign='center'>
          {isDragActive
            ? isDragAccept
              ? t('drop')
              : t('notAccepted')
            : t('dragAndDrop')}
        </Text>
      </Center>

      <FormHelperText>
        {t('acceptedExtensions', {
          extensions: Object.keys(acceptedFileTypes).join(', '),
        })}
      </FormHelperText>

      <Box mt={4}>
        <Text>{t('attachedFiles')}</Text>
        {filesToUpload.length === 0 &&
          displayableExistingFiles.length === 0 && (
            <Text my={2} fontStyle='italic' textAlign='center'>
              {t('noAttachedFiles')}
            </Text>
          )}

        {filesToUpload.map((file, index) => (
          <HStack key={`file_${file.name}`} justifyContent='space-between'>
            <HStack spacing={6}>
              <Icon as={AiOutlineFile} h={6} w={6} />
              <Text>{file.name}</Text>
            </HStack>
            <IconButton
              aria-label='delete'
              icon={<DeleteIcon />}
              variant='ghost'
              onClick={() => handleFileRemove(index)}
            />
          </HStack>
        ))}

        {displayableExistingFiles.map(file => (
          <HStack key={`file_${file.id}`} justifyContent='space-between'>
            <HStack spacing={6}>
              <Icon as={AiOutlineFile} h={6} w={6} />
              <Text>{file.name}</Text>
            </HStack>
            <IconButton
              aria-label='delete'
              icon={<DeleteIcon />}
              variant='ghost'
              onClick={() =>
                setExistingFilesToRemove(prev => [...prev, Number(file.id)])
              }
            />
          </HStack>
        ))}
      </Box>

      {fileRejections.length && (
        <Text color='error' fontStyle='italic' mt={4} textAlign='center'>
          {t('error')}
        </Text>
      )}
    </FormControl>
  )
}

export default Dropzone
