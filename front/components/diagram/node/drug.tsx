/**
 * The external imports
 */
import React from 'react'
import { memo } from 'react'
import { Text, Flex, useTheme, Box } from '@chakra-ui/react'
import { useTranslation } from 'next-i18next'

/**
 * The internal imports
 */
import NodeWrapper from '@/components/diagram/node/ui/nodeWrapper'
import { useProject } from '@/lib/hooks'
import { extractTranslation } from '@/lib/utils/string'
import type { DiagramNodeComponent } from '@/types'

const DrugNode: DiagramNodeComponent = ({
  data,
  fromAvailableNode = false,
}) => {
  const { t } = useTranslation('diagram')
  const { colors } = useTheme()

  const { projectLanguage } = useProject()

  return (
    <NodeWrapper
      backgroundColor={colors.diagram.drug}
      headerTitle={t('drug')}
      fromAvailableNode={fromAvailableNode}
      color='white'
    >
      <Box>
        <Flex
          px={12}
          py={4}
          justifyContent='center'
          bg='white'
          borderColor={colors.diagram.drug}
          borderBottomWidth={1}
          borderRightWidth={1}
          borderLeftWidth={1}
          borderBottomLeftRadius={10}
          borderBottomRightRadius={10}
        >
          <Text fontSize={fromAvailableNode ? 'sm' : 'lg'}>
            {`${data.fullReference} • ${extractTranslation(
              data.labelTranslations,
              projectLanguage
            )}`}
          </Text>
        </Flex>
      </Box>
    </NodeWrapper>
  )
}

export default memo(DrugNode)
