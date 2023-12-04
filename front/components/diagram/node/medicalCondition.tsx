/**
 * The external imports
 */
import { memo } from 'react'
import { Box, Text, Flex, useTheme } from '@chakra-ui/react'
import { useTranslation } from 'next-i18next'

/**
 * The internal imports
 */
import AlgorithmsIcon from '@/assets/icons/Algorithms'
import NodeAnswers from '@/components/diagram/node/ui/nodeAnswers'
import NodeWrapper from '@/components/diagram/node/ui/nodeWrapper'
import { useProject } from '@/lib/hooks/useProject'
import { extractTranslation } from '@/lib/utils/string'
import type { DiagramNodeComponent } from '@/types'

const MedicalConditionNode: DiagramNodeComponent = ({
  data,
  fromAvailableNode = false,
}) => {
  const { t } = useTranslation('variables')

  const { colors } = useTheme()

  const { projectLanguage } = useProject()

  return (
    <NodeWrapper
      backgroundColor={colors.primary}
      fromAvailableNode={fromAvailableNode}
      headerTitle={t(`categories.${data.category}.label`, {
        defaultValue: '',
      })}
      headerIcon={<AlgorithmsIcon color='white' />}
      color='white'
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
            {`${data.fullReference} • ${extractTranslation(
              data.labelTranslations,
              projectLanguage
            )}${data.minScore ? ` • ${data.minScore}` : ''}`}
          </Text>
        </Flex>
        {!fromAvailableNode && (
          <NodeAnswers answers={data.diagramAnswers} bg={colors.primary} />
        )}
      </Box>
    </NodeWrapper>
  )
}

export default memo(MedicalConditionNode)
