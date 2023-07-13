/**
 * The external imports
 */
import { ChangeEvent, useEffect, useState } from 'react'
import { Spinner, VStack, useTheme, Box, Text } from '@chakra-ui/react'
import { useTranslation } from 'next-i18next'

/**
 * The internal imports
 */
import { AvailableNode, Search } from '@/components'
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
  const [loading, setLoading] = useState(true)

  const [getAvailableNodes, { data, isSuccess, isFetching }] =
    useLazyGetAvailableNodesQuery()

  useEffect(() => {
    setLoading(true)
    getAvailableNodes({
      instanceableId,
      instanceableType: diagramType,
      searchTerm,
    })
  }, [searchTerm])

  useEffect(() => {
    if (isSuccess && !isFetching) {
      setLoading(false)
    }
  }, [isSuccess, isFetching])

  /**
   * Updates the search term and resets the pagination
   * @param {*} e Event object
   */
  const updateSearchTerm = (e: ChangeEvent<HTMLInputElement>): void => {
    setSearchTerm(e.target.value)
  }

  /**
   * Resets the search term to an empty string
   */
  const resetSearchTerm = () => {
    setSearchTerm('')
  }

  return (
    <VStack
      bg={colors.subMenu}
      boxShadow='-4px 0px 8px rgba(45, 45, 45, 0.1)'
      h='100vh'
      w={350}
    >
      <Box px={4} w='full' mt={4}>
        <Search
          updateSearchTerm={updateSearchTerm}
          resetSearchTerm={resetSearchTerm}
        />
      </Box>
      <VStack h='full' mt={4} spacing={4} w='full' overflowY='scroll' p={4}>
        {!loading ? (
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
