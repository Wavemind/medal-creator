/**
 * The external imports
 */
import { memo } from 'react'
import { VStack, useTheme } from '@chakra-ui/react'

/**
 * The internal imports
 */
import { Search, NodeFilter } from '@/components'
import { usePaginationFilter } from '@/lib/hooks'
import AvailableNodes from './availableNodes'
import type { DiagramTypeComponent } from '@/types'

const DiagramSideBar: DiagramTypeComponent = ({ diagramType }) => {
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
        <NodeFilter diagramType={diagramType} />
      </VStack>
      <AvailableNodes diagramType={diagramType} />
    </VStack>
  )
}

export default memo(DiagramSideBar)
