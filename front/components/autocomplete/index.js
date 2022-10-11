/**
 * The external imports
 */
import { useMemo } from 'react'
import { Box } from '@chakra-ui/react'

/**
 * The internal imports
 */
import Input from './input'
import Popover from './popover'

const Autocomplete = ({ data, search, setSearch }) => {
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

  /**
   * Defines if the autocomplete popover is open or not
   */
  const popoverIsOpen = useMemo(
    () => results.length > 0 && !search.selected,
    [results, search.selected]
  )

  return (
    <Box position='relative' width='30%'>
      <Input search={search} setSearch={setSearch} />
      {popoverIsOpen && <Popover results={results} setSearch={setSearch} />}
    </Box>
  )
}

export default Autocomplete
