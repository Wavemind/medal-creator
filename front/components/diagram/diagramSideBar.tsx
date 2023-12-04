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
import { usePaginationFilter } from '@/lib/hooks/usePaginationFilter'

const DiagramSideBar = () => {
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
      <AvailableNodes />
    </VStack>
  )
}

export default memo(DiagramSideBar)
