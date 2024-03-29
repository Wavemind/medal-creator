/**
 * The external imports
 */
import { useCallback, useMemo } from 'react'
import {
  Box,
  VStack,
  Text,
  Skeleton,
  Heading,
  Slider,
  SliderTrack,
  SliderFilledTrack,
  SliderThumb,
  SliderMark,
  List,
  ListItem,
  Icon,
  HStack,
} from '@chakra-ui/react'
import { useTranslation } from 'next-i18next'
import { FileImage, FileVideo2, FileAudio, FileDigit } from 'lucide-react'
import { Link } from '@chakra-ui/next-js'

/**
 * The internal imports
 */
import { useGetDiagnosisQuery } from '@/lib/api/modules/enhanced/diagnosis.enhanced'
import { mediaType, formatBytes } from '@/lib/utils/media'
import { extractTranslation } from '@/lib/utils/string'
import { useProject } from '@/lib/hooks/useProject'
import type { DiagnosisDetailComponent } from '@/types'

const DiagnosisDetail: DiagnosisDetailComponent = ({ diagnosisId }) => {
  const { t } = useTranslation('diagnoses')

  const { projectLanguage } = useProject()

  const { data: diagnosis, isSuccess: isSuccessDiag } = useGetDiagnosisQuery({
    id: diagnosisId,
  })

  /**
   * Returns the correct media icon based on extension
   */
  const icon = useCallback((extension: string) => {
    const type = mediaType(extension)
    switch (type) {
      case 'image':
        return FileImage
      case 'video':
        return FileVideo2
      case 'audio':
        return FileAudio
      case 'media':
        return FileDigit
    }
  }, [])

  /**
   * Designates whether a description exists for the diagnosis
   */
  const hasDescription = useMemo(() => {
    if (diagnosis) {
      return !!extractTranslation(
        diagnosis.descriptionTranslations,
        projectLanguage
      )
    }
    return false
  }, [diagnosis])

  if (isSuccessDiag) {
    return (
      <VStack spacing={10}>
        <Heading textAlign='center'>
          {extractTranslation(diagnosis.labelTranslations, projectLanguage)}
        </Heading>
        <VStack spacing={4} align='left' w='full'>
          <Text fontWeight='bold'>{t('description')}</Text>
          <Text fontStyle={hasDescription ? 'normal' : 'italic'}>
            {hasDescription
              ? extractTranslation(
                  diagnosis.descriptionTranslations,
                  projectLanguage
                )
              : t('noDescription')}
          </Text>
        </VStack>
        <VStack spacing={4} align='left' w='full'>
          <Text fontWeight='bold'>{t('levelOfUrgency')}</Text>
          <Box h={50}>
            <Slider
              defaultValue={diagnosis.levelOfUrgency}
              min={1}
              max={10}
              step={1}
              isDisabled
              _disabled={{
                opacity: 1,
              }}
            >
              {Array.from({ length: 10 }, (_, i) => i + 1).map(item => (
                <SliderMark
                  key={item}
                  value={item}
                  mt={4}
                  zIndex={12}
                  fontSize='sm'
                  _before={{
                    content: '""',
                    position: 'absolute',
                    top: -6,
                    left: 0,
                    borderWidth: 1,
                    height: 4,
                    borderColor: 'gray.800',
                  }}
                >
                  <Text ml={-0.5}>{item}</Text>
                </SliderMark>
              ))}

              <SliderTrack
                h={3}
                bgGradient='linear(to-r, green.300, yellow.300, orange.200, red.600)'
              >
                <SliderFilledTrack bg='transparent' />
              </SliderTrack>
              <SliderThumb
                boxSize={6}
                zIndex={100}
                _disabled={{ opacity: 1 }}
              />
            </Slider>
          </Box>
        </VStack>
        <VStack spacing={4} align='left' w='full'>
          <Text fontWeight='bold'>
            {t('dropzone.attachedFiles', { ns: 'common' })}
          </Text>
          <List spacing={4}>
            {diagnosis.files.length === 0 && (
              <Text fontStyle='italic'>
                {t('dropzone.noAttachedFiles', { ns: 'common' })}
              </Text>
            )}
            {diagnosis.files.map(file => (
              <ListItem key={`file_${file.name}`}>
                <HStack spacing={4} alignItems='center'>
                  <Icon as={icon(file.extension)} height={5} width={5} />
                  <Link
                    href={file.url}
                    target='_blank'
                    _hover={{
                      textDecoration: 'underline',
                      textUnderlineOffset: 4,
                    }}
                  >
                    {file.name}
                    <Text as='span' fontStyle='italic' fontSize='sm' ml={1}>
                      - {formatBytes(file.size)}
                    </Text>
                  </Link>
                </HStack>
              </ListItem>
            ))}
          </List>
        </VStack>
      </VStack>
    )
  }

  return (
    <Box>
      <Skeleton h={10} mb={4} />
      <Skeleton h={100} />
    </Box>
  )
}

export default DiagnosisDetail
