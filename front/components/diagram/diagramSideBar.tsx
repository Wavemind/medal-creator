/**
 * The external imports
 */
import { ChangeEvent, useCallback, useEffect, useState } from 'react'
import { Spinner, VStack, useTheme, Input, Box, Text } from '@chakra-ui/react'
import { debounce } from 'lodash'
import { useTranslation } from 'next-i18next'

/**
 * The internal imports
 */
import { AvailableNode } from '@/components'
import { useLazyGetAvailableNodesQuery } from '@/lib/api/modules'
import { useAppRouter } from '@/lib/hooks'
import type { DiagramTypeComponent } from '@/types'

const DiagramSideBar: DiagramTypeComponent = ({ diagramType }) => {
  const { t } = useTranslation('datatable')

  const { colors } = useTheme()
  const {
    query: { instanceableId },
  } = useAppRouter()
  const [searchTerm, setSearchTerm] = useState('')

  const [getAvailableNodes, { data, isSuccess }] =
    useLazyGetAvailableNodesQuery()

  useEffect(() => {
    getAvailableNodes({
      instanceableId,
      instanceableType: diagramType,
      searchTerm,
    })
  }, [searchTerm])

  /**
   * Updates the search term and resets the pagination
   * @param {*} e Event object
   */
  const updateSearchTerm = (e: ChangeEvent<HTMLInputElement>): void => {
    setSearchTerm(e.target.value)
  }

  /**
   * Debounces the search update by 0.3 seconds
   */
  const debouncedChangeHandler = useCallback(
    debounce(updateSearchTerm, 300),
    []
  )

  return (
    <VStack
      bg={colors.subMenu}
      boxShadow='-4px 0px 8px rgba(45, 45, 45, 0.1)'
      h='100vh'
      w={350}
    >
      <Box px={4} w='full' mt={4}>
        <Input onChange={debouncedChangeHandler} p={4} />
      </Box>
      <VStack h='full' mt={4} spacing={4} w='full' overflowY='scroll' p={4}>
        {isSuccess ? (
          data && data.length > 0 ? (
            data.map(node => <AvailableNode key={node.id} node={node} />)
          ) : (
            <Text>{t('noData')}</Text>
          )
        ) : (
          <Spinner />
        )}
      </VStack>
    </VStack>
  )
}

export default DiagramSideBar
