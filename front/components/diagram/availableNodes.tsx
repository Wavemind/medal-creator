/**
 * The external imports
 */
import { useEffect } from 'react'
import { Spinner, Text, Box, Center } from '@chakra-ui/react'
import { useTranslation } from 'next-i18next'
import InfiniteScroll from 'react-infinite-scroll-component'

/**
 * The internal imports
 */
import { AvailableNode } from '@/components'
import { useLazyGetAvailableNodesQuery } from '@/lib/api/modules'
import { useAppRouter, usePaginationFilter } from '@/lib/hooks'
import { DiagramService } from '@/lib/services'
import type {
  AvailableNode as AvailableNodeType,
  DiagramTypeComponent,
} from '@/types'

const AvailableNodes: DiagramTypeComponent = ({ diagramType }) => {
  const { t } = useTranslation('datatable')

  const {
    data: nodes,
    setData,
    filterState,
    setAfter,
    after,
  } = usePaginationFilter<AvailableNodeType>()

  const { searchTerm, isNeonat, categories } = filterState

  const {
    query: { instanceableId },
  } = useAppRouter()

  const [getAvailableNodes, { data, isSuccess, isFetching }] =
    useLazyGetAvailableNodesQuery()

  useEffect(() => {
    loadMore()
  }, [searchTerm, isNeonat, categories])

  useEffect(() => {
    if (isSuccess && data && !isFetching) {
      setData(prev => [...prev, ...data.edges.map(edge => edge.node)])
      setAfter(prev => data.pageInfo.endCursor || prev)
    }
  }, [isSuccess, isFetching])

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
        type: categories.map(category => category.value),
      },
    })
  }

  if (data) {
    return (
      <Box id='scrollableDiv' height='full' w='full' overflowY='scroll' my={4}>
        <InfiniteScroll
          dataLength={nodes.length}
          next={loadMore}
          hasMore={data.pageInfo.hasNextPage}
          loader={
            <Center>
              <Spinner />
            </Center>
          }
          scrollableTarget='scrollableDiv'
          endMessage={
            <Center>
              <Text>
                {nodes.length > 0 ? t('noMoreResults') : t('noResults')}
              </Text>
            </Center>
          }
        >
          {nodes.map(node => (
            <AvailableNode key={node.id} node={node} />
          ))}
        </InfiniteScroll>
      </Box>
    )
  }

  return (
    <Center>
      <Spinner />
    </Center>
  )
}

export default AvailableNodes
