/**
 * The external imports
 */
import { memo } from 'react'
import { VStack, useTheme } from '@chakra-ui/react'

/**
 * The internal imports
 */
import Search from '@/components/inputs/search'
import NodeFilter from '@/components/diagram/nodeFilter'
import AvailableNodes from '@/components/diagram/availableNodes'
import { usePaginationFilter } from '@/lib/hooks'
import type { DiagramTypeWithRefetchComponent } from '@/types'

const DiagramSideBar: DiagramTypeWithRefetchComponent = ({
  refetch,
  setRefetch,
}) => {
  const { colors } = useTheme()
  const { updateSearch, resetSearch } = usePaginationFilter()

  return (
    <VStack
      bg={colors.subMenu}
      boxShadow='-4px 0px 8px rgba(45, 45, 45, 0.1)'
      h='100vh'
      w={350}
    >
      <VStack alignItems='flex-end' px={4} w='full' mt={4} spacing={4}>
        <Search updateSearchTerm={updateSearch} resetSearchTerm={resetSearch} />
        <NodeFilter />
      </VStack>
      <AvailableNodes refetch={refetch} setRefetch={setRefetch} />
    </VStack>
  )
}

export default memo(DiagramSideBar)
