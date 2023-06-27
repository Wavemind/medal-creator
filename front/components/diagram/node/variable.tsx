/**
 * The external imports
 */
import { memo } from 'react'
import { Box, Text, Flex, useTheme, Skeleton } from '@chakra-ui/react'
import { useRouter } from 'next/router'
import type { FC } from 'react'

/**
 * The internal imports
 */
import NodeWrapper from './ui/nodeWrapper'
import NodeAnswers from './ui/nodeAnswers'
import { useGetProjectQuery } from '@/lib/api/modules'
import type { NodeData } from '@/types'

const VariableNode: FC<{ data: NodeData }> = ({ data }) => {
  const { colors } = useTheme()

  const {
    query: { projectId },
  } = useRouter()

  const {
    data: project,
    isSuccess: isProjectSuccess,
    isLoading,
  } = useGetProjectQuery(projectId)
  console.log(data)
  return (
    <Skeleton isLoaded={!isLoading}>
      <NodeWrapper
        handleColor={colors.handle}
        mainColor={colors.subMenu}
        headerTitle={data.type}
        textColor='primary'
      >
        <Box>
          <Flex
            px={12}
            py={4}
            justifyContent='center'
            bg='white'
            borderColor={colors.subMenu}
            borderRightWidth={1}
            borderLeftWidth={1}
          >
            <Text fontSize='lg'>
              {isProjectSuccess &&
                data.labelTranslations[project?.language.code]}
            </Text>
          </Flex>
          <NodeAnswers answers={data.answers} bg={colors.variableNode} />
        </Box>
      </NodeWrapper>
    </Skeleton>
  )
}

// TODO: Need attention, may cause problems with the memo
export default memo(VariableNode)
