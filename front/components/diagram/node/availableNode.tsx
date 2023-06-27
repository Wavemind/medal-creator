/**
 * The external imports
 */
import { useTranslation } from 'next-i18next'
import { useRouter } from 'next/router'
import { Box, Text, Flex, useTheme, VStack, Skeleton } from '@chakra-ui/react'
import { type FC, type DragEvent, memo } from 'react'

/**
 * The internal imports
 */
import { useGetProjectQuery } from '@/lib/api/modules'
import { ErrorMessage } from '@/components'
import type { AvailableNode } from '@/types'

const AvailableNode: FC<{
  node: AvailableNode
}> = ({ node }) => {
  const { t } = useTranslation('variables')
  const { colors } = useTheme()

  const {
    query: { projectId },
  } = useRouter()

  const {
    data: project,
    isSuccess: isProjectSuccess,
    isError,
    error,
    isLoading,
  } = useGetProjectQuery(projectId)

  const onDragStart = (event: DragEvent<HTMLDivElement>) => {
    event.dataTransfer.setData(
      'application/reactflow',
      JSON.stringify({
        id: node.id,
        category: node.category,
        labelTranslations: node.labelTranslations,
        diagramAnswers: node.diagramAnswers,
      })
    )
    event.dataTransfer.effectAllowed = 'move'
  }

  if (isError) {
    return <ErrorMessage error={error} />
  }

  return (
    <Skeleton isLoaded={!isLoading}>
      <VStack
        borderRadius={10}
        bg={colors.ordering}
        pt={1}
        onDragStart={event => onDragStart(event)}
        draggable
        cursor='grab'
      >
        <Flex w='full' px={3} py={1}>
          <Text
            align='left'
            color={colors.primary}
            fontSize='xs'
            fontWeight='bold'
          >
            {t(`categories.${node.category}.label`, {
              defaultValue: '',
            })}
          </Text>
        </Flex>
        <Box
          w='full'
          px={12}
          py={4}
          justifyContent='center'
          bg='white'
          borderBottomLeftRadius={10}
          borderBottomRightRadius={10}
        >
          <Text fontSize='lg'>
            {isProjectSuccess && node.labelTranslations[project.language.code]}
          </Text>
        </Box>
      </VStack>
    </Skeleton>
  )
}

export default memo(AvailableNode)
