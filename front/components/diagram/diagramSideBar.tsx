/**
 * The external imports
 */
import { Input, Spinner, VStack, useTheme } from '@chakra-ui/react'
import { useTranslation } from 'next-i18next'
import { useRouter } from 'next/router'
import type { FC } from 'react'

/**
 * The internal imports
 */
import { AvailableNode } from '@/components'
import { useGetAvailableNodesQuery } from '@/lib/api/modules'
import { DiagramType } from '@/lib/config/constants'

const DiagramSideBar: FC<{ diagramType: DiagramType }> = ({ diagramType }) => {
  const { colors, dimensions } = useTheme()
  const {
    query: { instanceableId },
  } = useRouter()

  const { data, isSuccess: isAvailableNodeSuccess } = useGetAvailableNodesQuery(
    {
      instanceableType: diagramType,
      instanceableId,
    }
  )

  return (
    <VStack
      top={dimensions.headerHeight}
      bg={colors.subMenu}
      width={dimensions.subMenuWidth}
      position='fixed'
      height={`calc(100vh - ${dimensions.headerHeight})`}
      boxShadow='-4px 0px 8px rgba(45, 45, 45, 0.1)'
      spacing={4}
    >
      <Input placeholder='Basic usage' mt={4} p={6} />
      <VStack mt={4} spacing={4} w='full' overflowY='scroll'>
        {isAvailableNodeSuccess ? (
          data.map(node => <AvailableNode key={node.id} node={node} />)
        ) : (
          <Spinner />
        )}
      </VStack>
    </VStack>
  )
}

export default DiagramSideBar
