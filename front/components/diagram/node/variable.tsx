/**
 * The external imports
 */
import { memo } from 'react'
import { Box, Text, Flex, useTheme } from '@chakra-ui/react'
import type { FC } from 'react'

/**
 * The internal imports
 */
import NodeWrapper from './ui/nodeWrapper'
import NodeAnswers from './ui/nodeAnswers'
import type { NodeData } from '@/types'

const VariableNode: FC<{ data: NodeData }> = ({ data }) => {
  const { colors } = useTheme()

  return (
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
          <Text fontSize='lg'>{data.label}</Text>
        </Flex>
        <NodeAnswers answers={data.answers} bg={colors.variableNode} />
      </Box>
    </NodeWrapper>
  )
}

// TODO: Need attention, may cause problems with the memo
export default memo(VariableNode)
