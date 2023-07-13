/**
 * The external imports
 */
import { useMemo, type ChangeEvent } from 'react'
import { useTranslation } from 'next-i18next'
import {
  Button,
  Menu,
  MenuButton,
  MenuList,
  MenuItem,
  HStack,
  Box,
} from '@chakra-ui/react'

/**
 * The internal imports
 */
import { SortIcon } from '@/assets/icons'
import { TABLE_COLUMNS } from '@/lib/config/constants'
import { Search } from '@/components'
import type { ToolbarComponent } from '@/types'

const Toolbar: ToolbarComponent = ({
  sortable,
  source,
  searchable,
  searchPlaceholder,
  setTableState,
}) => {
  const { t } = useTranslation('datatable')

  /**
   * Filters the columns to keep only the sortable ones
   */
  const sortableColumns = useMemo(
    () => TABLE_COLUMNS[source].filter(col => col.sortable),
    []
  )

  /**
   * Handles the sort functionality
   */
  const handleSort = () => {
    console.log('TODO')
  }

  /**
   * Updates the search term and resets the pagination
   * @param {*} e Event object
   */
  const updateSearchTerm = (e: ChangeEvent<HTMLInputElement>) => {
    setTableState(prevState => ({
      ...prevState,
      endCursor: '',
      startCursor: '',
      search: e.target.value,
      pageIndex: 1,
    }))
  }

  /**
   * Resets the search term and the pagination
   */
  const resetSearchTerm = () => {
    setTableState(prevState => ({
      ...prevState,
      endCursor: '',
      startCursor: '',
      search: '',
    }))
  }

  return (
    <HStack align='center' justify='space-between' pl={6} py={10} px={10}>
      {searchable && (
        <Box w='30%'>
          <Search
            updateSearchTerm={updateSearchTerm}
            resetSearchTerm={resetSearchTerm}
            placeholder={searchPlaceholder}
          />
        </Box>
      )}
      {sortable && (
        <Menu>
          <MenuButton as={Button} leftIcon={<SortIcon />} variant='ghost'>
            {t('sort')}
          </MenuButton>
          <MenuList>
            {sortableColumns.map(col => (
              <MenuItem key={col.accessorKey} onClick={handleSort}>
                {t(`${source}.${col.accessorKey}`, { defaultValue: '' })}
              </MenuItem>
            ))}
          </MenuList>
        </Menu>
      )}
    </HStack>
  )
}

export default Toolbar
