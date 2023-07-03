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
import NodeWrapper from './ui/nodeWrapper'
import NodeAnswers from './ui/nodeAnswers'
import { useGetProjectQuery } from '@/lib/api/modules'
import type { DiagramNodeComponent } from '@/types'

const VariableNode: DiagramNodeComponent = ({ data }) => {
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
  if (data.isNeonat) {
    console.log('data.isNeonat', data)
  }
  // Add toggle for developper mode
  return (
    <Skeleton isLoaded={!isLoading}>
      <NodeWrapper
        handleColor={colors.diagram.variable}
        mainColor={colors.diagram.variable}
        isNeonat={data.isNeonat}
        headerTitle={t(`categories.${data.category}.label`, {
          defaultValue: '',
        })}
        textColor='white'
      >
        <Box>
          <Flex
            px={12}
            py={4}
            justifyContent='center'
            bg='white'
            borderColor={colors.diagram.variable}
            borderRightWidth={1}
            borderLeftWidth={1}
          >
            <Text fontSize='lg'>
              {data.id} -{' '}
              {isProjectSuccess &&
                data.labelTranslations[project.language.code]}
            </Text>
          </Flex>
          <NodeAnswers
            answers={data.diagramAnswers}
            bg={colors.diagram.variable}
          />
        </Box>
      </NodeWrapper>
    </Skeleton>
  )
}

// TODO: Need attention, may cause problems with the memo
export default memo(VariableNode)
