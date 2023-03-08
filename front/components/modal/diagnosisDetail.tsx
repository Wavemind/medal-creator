/**
 * The external imports
 */
import { FC } from 'react'
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
} from '@chakra-ui/react'
import { useRouter } from 'next/router'
import { useTranslation } from 'next-i18next'

/**
 * The internal imports
 */
import {
  useGetDiagnosisQuery,
  useGetProjectQuery,
} from '@/lib/services/modules'
import OptimizedLink from '../optimizedLink'

/**
 * Type definitions
 */
type DiagnosisDetailProps = {
  diagnosisId: number
}

const DiagnosisDetail: FC<DiagnosisDetailProps> = ({ diagnosisId }) => {
  const { t } = useTranslation('diagnoses')
  const {
    query: { projectId },
  } = useRouter()

  const { data: diagnosis, isSuccess: isSuccessDiag } = useGetDiagnosisQuery(
    Number(diagnosisId)
  )
  const { data: project, isSuccess: isSuccessProj } = useGetProjectQuery(
    Number(projectId)
  )

  console.log(diagnosis)

  if (isSuccessProj && isSuccessDiag) {
    return (
      <VStack spacing={10}>
        <Heading>{diagnosis.labelTranslations[project.language.code]}</Heading>
        <VStack spacing={4} align='left' w='full'>
          <Text fontWeight='bold'>{t('description')}</Text>
          <Text>
            {diagnosis.descriptionTranslations[project.language.code]}
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
          <Text fontWeight='bold'>Attached files</Text>
          <List spacing={4}>
            {diagnosis.files.map(file => (
              <ListItem>
                <OptimizedLink
                  href={file.url}
                  target='_blank'
                  textDecoration='underline'
                >
                  {file.name}
                </OptimizedLink>
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
