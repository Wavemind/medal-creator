/**
 * The external imports
 */
import { memo } from 'react'
import { Text, Flex, useTheme, Box } from '@chakra-ui/react'
import { Handle, Position } from 'reactflow'
import type { FC } from 'react'

/**
 * The internal imports
 */
import { AlgorithmsIcon } from '@/assets/icons'
import NodeWrapper from './ui/nodeWrapper'
import type { NodeData } from '@/types'

const DiagnosisNode: FC<{ data: NodeData }> = ({ data }) => {
  const { colors } = useTheme()

  return (
    <NodeWrapper
      handleColor={colors.diagnosisHandle}
      mainColor={colors.secondary}
      headerTitle={data.type}
      headerIcon={<AlgorithmsIcon color='white' />}
      textColor='white'
    >
      <Box>
        <Handle
          id={`${data.label}-left`}
          type='source'
          position={Position.Left}
          isConnectable={true}
          style={{
            height: '20px',
            width: '20px',
            zIndex: '-1',
            borderRadius: '50%',
            left: '-10px',
            backgroundColor: colors.secondary,
          }}
        />
        <Handle
          id={`${data.label}-right`}
          type='target'
          position={Position.Right}
          isConnectable={true}
          style={{
            height: '20px',
            width: '20px',
            zIndex: '-1',
            borderRadius: '50%',
            right: '-10px',
            backgroundColor: colors.secondary,
          }}
        />
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
          <Text fontSize='lg'>{data.label}</Text>
        </Flex>
      </Box>
    </NodeWrapper>
  )
}

// TODO: Need attention, may cause problems with the memo
export default memo(DiagnosisNode)
