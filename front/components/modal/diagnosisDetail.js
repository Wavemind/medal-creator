/**
 * The external imports
 */
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
} from '@chakra-ui/react'
import { useRouter } from 'next/router'
import { useTranslation } from 'next-i18next'

/**
 * The internal imports
 */
import { useGetDiagnosisQuery } from '/lib/services/modules/diagnosis'
import { useGetProjectQuery } from '/lib/services/modules/project'

const DiagnosisDetail = ({ diagnosisId }) => {
  const { t } = useTranslation('diagnoses')
  const router = useRouter()
  const { projectId } = router.query

  const { data: diagnosis, isLoading: diagIsLoading } =
    useGetDiagnosisQuery(diagnosisId)
  const { data: project, isLoading: projIsLoading } =
    useGetProjectQuery(projectId)

  if (diagIsLoading || projIsLoading) {
    return (
      <Box>
        <Skeleton h={10} mb={4} />
        <Skeleton h={100} />
      </Box>
    )
  }

  return (
    <VStack spacing={10}>
      <Heading>{diagnosis.labelTranslations[project.language.code]}</Heading>
      <VStack spacing={4} align='left' w='full'>
        <Text fontWeight='bold'>{t('description')}</Text>
        <Text>{diagnosis.descriptionTranslations[project.language.code]}</Text>
      </VStack>
      <VStack spacing={4} align='left' w='full'>
        <Text fontWeight='bold'>{t('levelOfUrgency')}</Text>
        <Box h={50}>
          <Slider
            defaultValue={+diagnosis.levelOfUrgency}
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
            <SliderThumb boxSize={6} zIndex={100} _disabled={{ opacity: 1 }} />
          </Slider>
        </Box>
      </VStack>
    </VStack>
  )
}

export default DiagnosisDetail
