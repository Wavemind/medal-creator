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
import AvailableNode from '@/components/diagram/node/availableNode'
import { useLazyGetAvailableNodesQuery } from '@/lib/api/modules/enhanced/instance.enhanced'
import { useAppRouter } from '@/lib/hooks/useAppRouter'
import { useDiagram } from '@/lib/hooks/useDiagram'
import { usePaginationFilter } from '@/lib/hooks/usePaginationFilter'
import DiagramService from '@/lib/services/diagram.service'
import { convertSingleValueToBooleanOrNull } from '@/lib/utils/convert'
import type { AvailableNode as AvailableNodeType } from '@/types'

const AvailableNodes = () => {
  const { t } = useTranslation('datatable')
  const { diagramType, refetchNodes, setRefetchNodes } = useDiagram()

  const {
    data: nodes,
    setData,
    filterState,
    setAfter,
    after,
    currentPage,
    setCurrentPage,
  } = usePaginationFilter<AvailableNodeType>()

  const { searchTerm, selectedIsNeonat, selectedCategories } = filterState

  const {
    query: { instanceableId },
  } = useAppRouter()

  const [getAvailableNodes, { data, isSuccess, isFetching }] =
    useLazyGetAvailableNodesQuery()

  useEffect(() => {
    loadMore()
  }, [searchTerm, selectedIsNeonat, selectedCategories])

  useEffect(() => {
    if (isSuccess && data && !isFetching) {
      if (refetchNodes) {
        setData(data.edges.map(edge => edge.node))
        setRefetchNodes(false)
      } else {
        setData(prev => [...prev, ...data.edges.map(edge => edge.node)])
      }
      setAfter(prev => data.pageInfo.endCursor || prev)
    }
  }, [isSuccess, isFetching])

  useEffect(() => {
    if (refetchNodes) {
      getAvailableNodes({
        instanceableId,
        instanceableType: diagramType,
        after: '',
        before: '',
        searchTerm,
        first: currentPage * DiagramService.DEFAULT_AVAILABLE_NODES_PER_PAGE,
        filters: {
          isNeonat: convertSingleValueToBooleanOrNull(selectedIsNeonat),
          types: selectedCategories.map(category => category.value),
        },
      })
    }
  }, [refetchNodes])

  const loadMore = () => {
    getAvailableNodes({
      instanceableId,
      instanceableType: diagramType,
      after,
      before: '',
      searchTerm,
      first: DiagramService.DEFAULT_AVAILABLE_NODES_PER_PAGE,
      filters: {
        isNeonat: convertSingleValueToBooleanOrNull(selectedIsNeonat),
        types: selectedCategories.map(category => category.value),
      },
    })
  }

  if (data) {
    return (
      <Box id='scrollableDiv' height='full' w='full' overflowY='scroll' my={4}>
        <InfiniteScroll
          scrollableTarget='scrollableDiv'
          dataLength={nodes.length}
          next={() => {
            loadMore()
            setCurrentPage(prev => prev + 1)
          }}
          hasMore={data.pageInfo.hasNextPage}
          loader={
            <Center>
              <Spinner />
            </Center>
          }
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
