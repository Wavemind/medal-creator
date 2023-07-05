/**
 * The external imports
 */
import React from 'react'
import { memo } from 'react'
import { Text, Flex, useTheme, Box, Skeleton } from '@chakra-ui/react'
import { Handle, Position } from 'reactflow'
import { useRouter } from 'next/router'
import { useTranslation } from 'next-i18next'

/**
 * The internal imports
 */
import { AlgorithmsIcon } from '@/assets/icons'
import { useGetProjectQuery } from '@/lib/api/modules'
import NodeWrapper from './ui/nodeWrapper'
import type { DiagramNodeComponent } from '@/types'

const DiagnosisNode: DiagramNodeComponent = ({
  data,
  fromAvailableNode = false,
}) => {
  const { t } = useTranslation('diagram')
  const { colors } = useTheme()

  const {
    query: { projectId },
  } = useRouter()

  const {
    data: project,
    isSuccess: isProjectSuccess,
    isLoading,
  } = useGetProjectQuery(Number(projectId))

  return (
    <Skeleton isLoaded={!isLoading}>
      <NodeWrapper
        mainColor={colors.secondary}
        headerTitle={t('treatment')}
        fromAvailableNode={fromAvailableNode}
        headerIcon={<AlgorithmsIcon color='white' />}
        textColor='white'
      >
        <Box>
          {!fromAvailableNode && (
            <React.Fragment>
              <Handle
                id={`${data.id}-left`}
                type='source'
                position={Position.Left}
                isConnectable={true}
                className='diagnosis_excluding_handle'
                style={{
                  borderColor: `transparent transparent ${colors.diagram.diagnosisExcludingHandle} transparent`,
                }}
              />
              <Handle
                id={`${data.id}-right`}
                type='target'
                position={Position.Right}
                isConnectable={true}
                className='diagnosis_excluded_handle'
                style={{
                  backgroundColor: colors.diagram.diagnosisExcludedHandle,
                }}
              />
            </React.Fragment>
          )}

          <Flex
            px={12}
            py={4}
            justifyContent='center'
            bg='white'
            borderColor={colors.secondary}
            borderBottomWidth={1}
            borderRightWidth={1}
            borderLeftWidth={1}
            borderBottomLeftRadius={10}
            borderBottomRightRadius={10}
          >
            <Text fontSize='lg'>
              {data.id} -{' '}
              {isProjectSuccess &&
                data.labelTranslations[project.language.code]}
            </Text>
          </Flex>
        </Box>
      </NodeWrapper>
    </Skeleton>
  )
}

// TODO: Need attention, may cause problems with the memo
export default memo(DiagnosisNode)
