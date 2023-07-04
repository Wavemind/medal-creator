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
        handleColor={colors.secondary} // TODO: REMOVE DUPLICATION IF USED
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
                style={{
                  background: 'transparent',
                  height: 0,
                  width: 0,
                  borderWidth: '0 15px 30px 15px',
                  borderStyle: 'solid',
                  borderColor: `transparent transparent ${colors.diagram.diagnosisExcludingHandle} transparent`,
                  rotate: '-90deg',
                  zIndex: '-1',
                  top: '35px',
                }}
              />
              <Handle
                id={`${data.id}-right`}
                type='target'
                position={Position.Right}
                isConnectable={true}
                style={{
                  height: '20px',
                  width: '20px',
                  zIndex: '-1',
                  right: '-10px',
                  backgroundColor: colors.diagram.diagnosisExcludedHandle,
                  clipPath:
                    'polygon(50% 0%, 100% 25%, 100% 75%, 50% 100%, 0% 75%, 0% 25%)',
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
