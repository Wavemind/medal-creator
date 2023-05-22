/**
 * The external imports
 */
import { VStack } from '@chakra-ui/react'
import { useTranslation } from 'next-i18next'

/**
 * The internal imports
 */
import { Dropzone } from '@/components'
import { FILE_EXTENSIONS_AUTHORIZED } from '@/lib/config/constants'
import type { MediaComponent } from '@/types'

const Media: MediaComponent = ({
  filesToAdd,
  setFilesToAdd,
  existingFilesToRemove,
  setExistingFilesToRemove,
}) => {
  const { t } = useTranslation('common')

  return (
    <VStack>
      <Dropzone
        label={t('dropzone.mediaUpload')}
        name='mediaUpload'
        multiple
        acceptedFileTypes={FILE_EXTENSIONS_AUTHORIZED}
        existingFiles={[]}
        setExistingFilesToRemove={setExistingFilesToRemove}
        existingFilesToRemove={existingFilesToRemove}
        filesToAdd={filesToAdd}
        setFilesToAdd={setFilesToAdd}
      />
    </VStack>
  )
}

export default Media