/**
 * The external imports
 */
import { useCallback, useMemo } from 'react'
import { AiOutlineFileAdd, AiOutlineFile } from 'react-icons/ai'
import { useDropzone } from 'react-dropzone'
import { useTranslation } from 'next-i18next'
import { Link } from '@chakra-ui/next-js'
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
import DeleteIcon from '@/assets/icons/Delete'
import { DropzoneComponent } from '@/types'

const Dropzone: DropzoneComponent = ({
  label,
  name,
  multiple,
  acceptedFileTypes,
  filesToAdd,
  setFilesToAdd,
  existingFiles,
  setExistingFilesToRemove,
  existingFilesToRemove,
}) => {
  const { t } = useTranslation('common')

  // Callback to add the accepted files to list of attached files
  const onDrop = useCallback((acceptedFiles: File[]) => {
    setFilesToAdd(prev => [...prev, ...acceptedFiles])
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
    multiple,
    accept: acceptedFileTypes,
  })

  // Removes the file from the list of attached files
  const handleFileRemove = (index: number) => {
    setFilesToAdd(prev => {
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
              ? t('dropzone.drop')
              : t('dropzone.notAccepted')
            : t('dropzone.dragAndDrop')}
        </Text>
      </Center>

      <FormHelperText>
        {t('dropzone.acceptedExtensions', {
          extensions: Object.keys(acceptedFileTypes).join(', '),
        })}
      </FormHelperText>

      <Box mt={4}>
        <Text>{t('dropzone.attachedFiles')}</Text>
        {filesToAdd.length === 0 && displayableExistingFiles.length === 0 && (
          <Text my={2} fontStyle='italic' textAlign='center'>
            {t('dropzone.noAttachedFiles')}
          </Text>
        )}

        {filesToAdd.map((file, index) => (
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
              <Link
                href={file.url}
                target='_blank'
                _hover={{ textDecoration: 'underline' }}
              >
                {file.name}
              </Link>
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

      {fileRejections.length ? (
        <Text color='error' fontStyle='italic' mt={4} textAlign='center'>
          {t('dropzone.error')}
        </Text>
      ) : null}
    </FormControl>
  )
}

export default Dropzone
