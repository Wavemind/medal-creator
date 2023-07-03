/**
 * The external imports
 */
import {
  ChangeEvent,
  ReactElement,
  useCallback,
  useEffect,
  useState,
} from 'react'
import { Spinner, VStack, useTheme, Input } from '@chakra-ui/react'
import { useRouter } from 'next/router'
import { debounce } from 'lodash'

/**
 * The internal imports
 */
import { AvailableNode } from '@/components'
import { useLazyGetAvailableNodesQuery } from '@/lib/api/modules'
import { DiagramSideBarComponent } from '@/types'

const DiagramSideBar: DiagramSideBarComponent = ({ diagramType }) => {
  const { colors, dimensions } = useTheme()
  const {
    query: { instanceableId },
  } = useRouter()
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
      top={dimensions.headerHeight}
      bg={colors.subMenu}
      width={dimensions.subMenuWidth}
      position='fixed'
      height={`calc(100vh - ${dimensions.headerHeight})`}
      boxShadow='-4px 0px 8px rgba(45, 45, 45, 0.1)'
      spacing={4}
    >
      <Input onChange={debouncedChangeHandler} mt={4} p={6} />
      <VStack mt={4} spacing={4} w='full' overflowY='scroll'>
        {isSuccess && data ? (
          data.map(node => <AvailableNode key={node.id} node={node} />)
        ) : (
          <Spinner />
        )}
      </VStack>
    </VStack>
  )
}

export default DiagramSideBar