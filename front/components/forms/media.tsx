/**
 * The external imports
 */
import { VStack } from '@chakra-ui/react'
import { useTranslation } from 'next-i18next'

/**
 * The internal imports
 */
import Dropzone from '@/components/inputs/dropzone'
import { FILE_EXTENSIONS_AUTHORIZED } from '@/lib/config/constants'
import type { MediaComponent } from '@/types'

const Media: MediaComponent = ({
  filesToAdd,
  setFilesToAdd,
  existingFiles,
  existingFilesToRemove,
  setExistingFilesToRemove,
  isRestricted = false,
}) => {
  const { t } = useTranslation('common')

  return (
    <VStack>
      <Dropzone
        label={t('dropzone.mediaUpload')}
        name='mediaUpload'
        multiple
        acceptedFileTypes={FILE_EXTENSIONS_AUTHORIZED}
        existingFiles={existingFiles}
        setExistingFilesToRemove={setExistingFilesToRemove}
        existingFilesToRemove={existingFilesToRemove}
        filesToAdd={filesToAdd}
        setFilesToAdd={setFilesToAdd}
        isDisabled={isRestricted}
      />
    </VStack>
  )
}

export default Media
