/**
 * The external imports
 */
import { ChangeEvent, useCallback, useEffect, useState } from 'react'
import { Spinner, VStack, useTheme, Input, Box } from '@chakra-ui/react'
import { useRouter } from 'next/router'
import { debounce } from 'lodash'

/**
 * The internal imports
 */
import { AvailableNode } from '@/components'
import { useLazyGetAvailableNodesQuery } from '@/lib/api/modules'
import { DiagramTypeComponent } from '@/types'

const DiagramSideBar: DiagramTypeComponent = ({ diagramType }) => {
  const { colors } = useTheme()
  const {
    query: { instanceableId },
  } = useRouter()
  const [searchTerm, setSearchTerm] = useState('')

  const [getAvailableNodes, { data, isSuccess }] =
    useLazyGetAvailableNodesQuery()

  useEffect(() => {
    // TODO : Get rid of this when merging with setup-codegen
    if (typeof instanceableId === 'string') {
      getAvailableNodes({
        instanceableId,
        instanceableType: diagramType,
        searchTerm,
      })
    }
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
