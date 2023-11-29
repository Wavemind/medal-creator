/**
 * The external imports
 */
import { memo } from 'react'
import { Box, Text, Flex, useTheme } from '@chakra-ui/react'
import { useTranslation } from 'next-i18next'

/**
 * The internal imports
 */
import NodeWrapper from '@/components/diagram/node/ui/nodeWrapper'
import NodeAnswers from '@/components/diagram/node/ui/nodeAnswers'
import { useProject } from '@/lib/hooks'
import { extractTranslation } from '@/lib/utils/string'
import type { DiagramNodeComponent } from '@/types'

const VariableNode: DiagramNodeComponent = ({
  data,
  fromAvailableNode = false,
}) => {
  const { t } = useTranslation('variables')
  const { colors } = useTheme()

  const { projectLanguage } = useProject()

  return (
    <NodeWrapper
      backgroundColor={colors.diagram.variable}
      isNeonat={data.isNeonat}
      headerTitle={t(`categories.${data.category}.label`, {
        defaultValue: '',
      })}
      color='white'
      fromAvailableNode={fromAvailableNode}
    >
      <Box h='full'>
        <Flex
          px={fromAvailableNode ? 2 : 12}
          py={fromAvailableNode ? 2 : 4}
          justifyContent='center'
          bg='white'
          borderColor={colors.diagram.variable}
          borderRightWidth={1}
          borderLeftWidth={1}
          borderBottomWidth={fromAvailableNode ? 1 : 0}
          borderBottomRadius={fromAvailableNode ? 10 : 0}
        >
          <Text fontSize={fromAvailableNode ? 'sm' : 'lg'}>
            {`${data.fullReference} • ${extractTranslation(
              data.labelTranslations,
              projectLanguage
            )}`}
          </Text>
        </Flex>
        {!fromAvailableNode && (
          <NodeAnswers
            answers={data.diagramAnswers}
            bg={colors.diagram.variable}
          />
        )}
      </Box>
    </NodeWrapper>
  )
}

export default memo(VariableNode)
