/**
 * The external imports
 */
import { memo } from 'react'
import { Box, Text, Flex, useTheme, Skeleton } from '@chakra-ui/react'
import { useTranslation } from 'next-i18next'

/**
 * The internal imports
 */
import AlgorithmsIcon from '@/assets/icons/Algorithms'
import { useGetProjectQuery } from '@/lib/api/modules'
import NodeAnswers from './ui/nodeAnswers'
import NodeWrapper from './ui/nodeWrapper'
import { useAppRouter } from '@/lib/hooks'
import { extractTranslation } from '@/lib/utils/string'
import type { DiagramNodeComponent } from '@/types'

const MedicalConditionNode: DiagramNodeComponent = ({
  data,
  fromAvailableNode = false,
}) => {
  const { t } = useTranslation('variables')

  const { colors } = useTheme()

  const {
    query: { projectId },
  } = useAppRouter()

  const { data: project, isLoading } = useGetProjectQuery({ id: projectId })

  return (
    <Skeleton isLoaded={!isLoading}>
      <NodeWrapper
        mainColor={colors.primary}
        fromAvailableNode={fromAvailableNode}
        headerTitle={t(`categories.${data.category}.label`, {
          defaultValue: '',
        })}
        headerIcon={<AlgorithmsIcon color='white' />}
        textColor='white'
      >
        <Box>
          <Flex
            px={fromAvailableNode ? 4 : 12}
            py={4}
            justifyContent='center'
            bg='white'
            borderColor={colors.primary}
            borderRightWidth={1}
            borderLeftWidth={1}
            borderBottomWidth={fromAvailableNode ? 1 : 0}
            borderBottomRadius={fromAvailableNode ? 10 : 0}
          >
            <Text fontSize={fromAvailableNode ? 'sm' : 'lg'}>
              {extractTranslation(
                data.labelTranslations,
                project?.language.code
              )}
            </Text>
          </Flex>
          {!fromAvailableNode && (
            <NodeAnswers answers={data.diagramAnswers} bg={colors.primary} />
          )}
        </Box>
      </NodeWrapper>
    </Skeleton>
  )
}

export default memo(MedicalConditionNode)
