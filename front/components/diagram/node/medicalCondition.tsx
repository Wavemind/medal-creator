/**
 * The external imports
 */
import { memo } from 'react'
import { Box, Text, Flex, useTheme } from '@chakra-ui/react'
import type { FC } from 'react'

/**
 * The internal imports
 */
import { AlgorithmsIcon } from '@/assets/icons'
import NodeAnswers from './ui/nodeAnswers'
import NodeWrapper from './ui/nodeWrapper'
import type { NodeData } from '@/types'

const MedicalConditionNode: FC<{ data: NodeData }> = ({ data }) => {
  const { colors } = useTheme()

  return (
    <NodeWrapper
      handleColor={colors.handle}
      mainColor={colors.primary}
      headerTitle={data.type}
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
          <Text fontSize='lg'>{data.label}</Text>
        </Flex>
        <NodeAnswers answers={data.answers} bg={colors.primary} />
      </Box>
    </NodeWrapper>
  )
}

// TODO: Need attention, may cause problems with the memo
export default memo(MedicalConditionNode)
