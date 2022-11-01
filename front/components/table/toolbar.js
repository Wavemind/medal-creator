/**
 * The external imports
 */
import { useMemo } from 'react'
import { useTranslation } from 'next-i18next'
import {
  Button,
  Menu,
  MenuButton,
  MenuList,
  MenuItem,
  HStack,
  Text,
  Input as ChakraInput,
  InputGroup,
  InputLeftElement,
  InputRightElement,
  useTheme,
} from '@chakra-ui/react'

/**
 * The internal imports
 */
import { SortIcon, CloseIcon, SearchIcon } from '/assets/icons'

const Toolbar = ({
  sortable,
  headers,
  searchable,
  searchPlaceholder,
  tableState,
  setTableState,
  title,
}) => {
  const { t } = useTranslation('datatable')
  const { colors } = useTheme()

  /**
   * Filters the columns to keep only the sortable ones
   */
  const sortableColumns = useMemo(
    () => headers.filter(header => header.column.getCanSort()),
    [headers]
  )

  /**
   * Updates the search term and resets the pagination
   * @param {*} e Event object
   */
  const updateSearchTerm = e => {
    setTableState(prevState => ({
      ...prevState,
      endCursor: '',
      startCursor: '',
      search: e.target.value,
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
    <HStack align='center' justify='space-between' pl={6} pr={10} py={5}>
      {title && <Text fontWeight='bold'>{title}</Text>}
      {searchable && (
        <InputGroup w='30%'>
          <InputLeftElement pointerEvents='none'>
            <SearchIcon color={colors.sidebar} />
          </InputLeftElement>
          <ChakraInput
            value={tableState.search}
            type='text'
            placeholder={searchPlaceholder}
            onChange={updateSearchTerm}
          />
          {tableState.search.length > 0 && (
            <InputRightElement onClick={resetSearchTerm}>
              <CloseIcon />
            </InputRightElement>
          )}
        </InputGroup>
      )}
      {sortable && (
        <Menu>
          <MenuButton as={Button} leftIcon={<SortIcon />} variant='ghost'>
            {t('sort')}
          </MenuButton>
          <MenuList>
            {sortableColumns.map(col => (
              <MenuItem
                key={col.id}
                {...{
                  // Please don't ask me why I have to do this. It doesn't work otherwise :(
                  onClick: col.column.getToggleSortingHandler(),
                }}
              >
                {col.column.columnDef.header}
              </MenuItem>
            ))}
          </MenuList>
        </Menu>
      )}
    </HStack>
  )
}

export default Toolbar
