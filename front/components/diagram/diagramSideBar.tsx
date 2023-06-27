/**
 * The external imports
 */
import { Input, Spinner, VStack, useTheme } from '@chakra-ui/react'
import { useRouter } from 'next/router'
import type { FC } from 'react'

/**
 * The internal imports
 */
import { AvailableNode } from '@/components'
import {
  useGetAvailableNodesQuery,
  useGetProjectQuery,
} from '@/lib/api/modules'
import { DiagramType } from '@/lib/config/constants'

const DiagramSideBar: FC<{ diagramType: DiagramType }> = ({ diagramType }) => {
  const { colors, dimensions } = useTheme()
  const {
    query: { instanceableId, projectId },
  } = useRouter()

  const { data: project, isSuccess: isProjectSuccess } =
    useGetProjectQuery(projectId)

  // SSR ?
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
        {isAvailableNodeSuccess && isProjectSuccess ? (
          data.map(node => (
            <AvailableNode
              key={node.id}
              id={node.id}
              type='variable'
              label={node.labelTranslations[project?.language.code]}
              title={node.category}
              answers={JSON.parse(node.answersJson)}
            />
          ))
        ) : (
          <Spinner />
        )}
      </VStack>
    </VStack>
  )
}

export default DiagramSideBar
