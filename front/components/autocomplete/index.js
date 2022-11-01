/**
 * The external imports
 */
import { useMemo } from 'react'
import { Box } from '@chakra-ui/react'

/**
 * The internal imports
 */
import Input from './input'

const Autocomplete = ({ data, search, searchPlaceholder, setSearch }) => {
  /**
   * Filters the shown data based on the search term
   */
  const results = useMemo(() => {
    if (search.term.length > 0) {
      return data.filter(item =>
        item.name.toLowerCase().includes(search.term.toLowerCase())
      )
    }
    return []
  }, [search])

  return (
    <Box position='relative' width='30%'>
      <Input
        search={search}
        searchPlaceholder={searchPlaceholder}
        setSearch={setSearch}
      />
    </Box>
  )
}

export default Autocomplete
