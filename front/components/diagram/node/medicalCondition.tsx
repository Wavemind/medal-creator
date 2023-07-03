/**
 * The external imports
 */
import { memo } from 'react'
import { Box, Text, Flex, useTheme, Skeleton } from '@chakra-ui/react'
import { useRouter } from 'next/router'
import { useTranslation } from 'next-i18next'

/**
 * The internal imports
 */
import { AlgorithmsIcon } from '@/assets/icons'
import { useGetProjectQuery } from '@/lib/api/modules'
import NodeAnswers from './ui/nodeAnswers'
import NodeWrapper from './ui/nodeWrapper'
import type { DiagramNodeComponent } from '@/types'

const MedicalConditionNode: DiagramNodeComponent = ({ data }) => {
  const { t } = useTranslation('variables')

  const { colors } = useTheme()

  const {
    query: { projectId },
  } = useRouter()

  const {
    data: project,
    isSuccess: isProjectSuccess,
    isLoading,
  } = useGetProjectQuery(projectId)

  return (
    <Skeleton isLoaded={!isLoading}>
      <NodeWrapper
        handleColor={colors.primary}
        mainColor={colors.primary}
        headerTitle={t(`categories.${data.category}.label`, {
          defaultValue: '',
        })}
        headerIcon={<AlgorithmsIcon color='white' />}
        textColor='white'
      >
        <Box>
          <Flex
            px={12}
            py={4}
            justifyContent='center'
            bg='white'
            borderColor={colors.primary}
            borderRightWidth={1}
            borderLeftWidth={1}
          >
            <Text fontSize='lg'>
              {isProjectSuccess &&
                data.labelTranslations[project.language.code]}
            </Text>
          </Flex>
          <NodeAnswers answers={data.diagramAnswers} bg={colors.primary} />
        </Box>
      </NodeWrapper>
    </Skeleton>
  )
}

// TODO: Need attention, may cause problems with the memo
export default memo(MedicalConditionNode)
