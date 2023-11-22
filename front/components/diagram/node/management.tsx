/**
 * The external imports
 */
import React, { memo } from 'react'
import { Text, Flex, useTheme, Box } from '@chakra-ui/react'
import { useTranslation } from 'next-i18next'

/**
 * The internal imports
 */
import NodeWrapper from '@/components/diagram/node/ui/nodeWrapper'
import { useProject } from '@/lib/hooks'
import { extractTranslation } from '@/lib/utils/string'
import type { DiagramNodeComponent } from '@/types'

const ManagementNode: DiagramNodeComponent = ({
  data,
  fromAvailableNode = false,
}) => {
  const { t } = useTranslation('diagram')
  const { colors } = useTheme()

  const { projectLanguage } = useProject()

  return (
    <NodeWrapper
      backgroundColor={colors.diagram.management}
      headerTitle={t('management')}
      fromAvailableNode={fromAvailableNode}
      color='white'
    >
      <Flex
        px={12}
        py={4}
        justifyContent='center'
        bg='white'
        borderColor={colors.diagram.management}
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
    </NodeWrapper>
  )
}

export default memo(ManagementNode)
