/**
 * The external imports
 */
import { memo } from 'react'
import { Box, Text, Flex, useTheme, Skeleton } from '@chakra-ui/react'
import { useTranslation } from 'next-i18next'
import type { FC } from 'react'

/**
 * The internal imports
 */
import { AlgorithmsIcon } from '@/assets/icons'
import { useRouter } from 'next/router'
import { useGetProjectQuery } from '@/lib/api/modules'
import NodeAnswers from './ui/nodeAnswers'
import NodeWrapper from './ui/nodeWrapper'
import type { AvailableNode } from '@/types'

const MedicalConditionNode: FC<{ data: AvailableNode }> = ({ data }) => {
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
        handleColor={colors.handle}
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
                data.labelTranslations[project?.language.code]}
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
