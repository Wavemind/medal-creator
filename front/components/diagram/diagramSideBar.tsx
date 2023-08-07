/**
 * The external imports
 */
import React, { type ChangeEvent, useEffect, useState } from 'react'
import {
  Spinner,
  VStack,
  useTheme,
  Text,
  Button,
  Flex,
  Box,
} from '@chakra-ui/react'
import { useTranslation } from 'next-i18next'
import InfiniteScroll from 'react-infinite-scroll-component'
import type { MultiValue, SingleValue } from 'chakra-react-select'

/**
 * The internal imports
 */
import { AvailableNode, Search, NodeFilter } from '@/components'
import { useLazyGetAvailableNodesQuery } from '@/lib/api/modules'
import { useAppRouter } from '@/lib/hooks'
import { DiagramService } from '@/lib/services'
import type {
  AvailableNode as AvailableNodeType,
  DiagramTypeComponent,
  Option,
} from '@/types'

// TODO: Add categories and is neonat filters + text if user attempt the end + clean + ssr ?
const DiagramSideBar: DiagramTypeComponent = ({ diagramType }) => {
  const { t } = useTranslation('datatable')

  const { colors } = useTheme()
  const {
    query: { instanceableId },
  } = useAppRouter()

  const [searchTerm, setSearchTerm] = useState('')
  const [after, setAfter] = useState('')
  const [nodes, setNodes] = useState<AvailableNodeType[]>([])
  const [isNeonat, setIsNeonat] = useState<boolean | null>(null)

  const [selectedCategories, setSelectedCategories] = useState<
    MultiValue<Option>
  >([])

  const [getAvailableNodes, { data, isSuccess, isFetching }] =
    useLazyGetAvailableNodesQuery()

  useEffect(() => {
    loadMore()
  }, [searchTerm, isNeonat, selectedCategories])

  /**
   * Updates the search term and resets the pagination
   * @param {*} e Event object
   */
  const updateSearchTerm = (e: ChangeEvent<HTMLInputElement>): void => {
    setNodes([])
    setAfter('')
    setSearchTerm(e.target.value)
  }

  /**
   * Resets the search term to an empty string
   */
  const resetSearchTerm = (): void => {
    setNodes([])
    setAfter('')
    setSearchTerm('')
  }

  console.log(selectedCategories)

  const loadMore = () => {
    getAvailableNodes({
      instanceableId,
      instanceableType: diagramType,
      after,
      before: '',
      searchTerm,
      first: DiagramService.DEFAULT_AVAILABLE_NODES_PER_PAGE,
      filters: {
        isNeonat: isNeonat,
        type: selectedCategories.map(category => category.value),
      },
    })
  }

  useEffect(() => {
    if (isSuccess && data && !isFetching) {
      setNodes(prev => [...prev, ...data.edges.map(edge => edge.node)])
      setAfter(prev => data.pageInfo.endCursor || prev)
    }
  }, [isSuccess, isFetching])

  return (
    <VStack
      bg={colors.subMenu}
      boxShadow='-4px 0px 8px rgba(45, 45, 45, 0.1)'
      h='100vh'
      w={350}
    >
      <VStack alignItems='flex-end' px={4} w='full' mt={4} spacing={4}>
        <Search
          updateSearchTerm={updateSearchTerm}
          resetSearchTerm={resetSearchTerm}
        />
        <NodeFilter
          isNeonat={isNeonat}
          setIsNeonat={setIsNeonat}
          selectedCategories={selectedCategories}
          setSelectedCategories={setSelectedCategories}
        />
      </VStack>

      {data && nodes.length > 0 ? (
        <Box id='scrollableDiv' height='full' overflowY='scroll'>
          <InfiniteScroll
            dataLength={nodes.length}
            next={loadMore}
            hasMore={data.pageInfo.hasNextPage}
            loader={<Spinner />}
            scrollableTarget='scrollableDiv'
            endMessage={
              <p style={{ textAlign: 'center' }}>
                <b>Yay! You have seen it all</b>
              </p>
            }
          >
            {nodes.map(node => (
              <AvailableNode key={node.id} node={node} />
            ))}
          </InfiniteScroll>
        </Box>
      ) : (
        <Text>{t('noData')}</Text>
      )}
    </VStack>
  )
}

export default DiagramSideBar
