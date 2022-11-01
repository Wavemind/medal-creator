/**
 * The external imports
 */
import { useEffect, useMemo, useRef, useState } from 'react'
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
  Kbd,
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
  const searchRef = useRef(null)
  const [isWindows, setIsWindows] = useState(true)

  /**
   * Filters the columns to keep only the sortable ones
   */
  const sortableColumns = useMemo(
    () => headers.filter(header => header.column.getCanSort()),
    [headers]
  )

  useEffect(() => {
    setIsWindows(navigator.platform.indexOf('Win') > -1)
  }, [])

  /**
   * Sets an event listener to listen for the Meta/Ctrl + K combination
   * On combination press, focus the search input
   */
  useEffect(() => {
    const handleKeyDown = e => {
      if (
        (!isWindows && e.metaKey && e.which === 75) ||
        (isWindows && e.ctrlKey && e.which === 75)
      ) {
        searchRef.current.focus()
        e.preventDefault()
      }
    }

    document.addEventListener('keydown', handleKeyDown)

    return () => {
      document.removeEventListener('keydown', handleKeyDown)
    }
  }, [isWindows])

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
    <HStack align='center' justify='space-between' pl={6} pr={10} py={5}>
      {title && <Text fontWeight='bold'>{title}</Text>}
      {searchable && (
        <InputGroup w='30%'>
          <InputLeftElement pointerEvents='none'>
            <SearchIcon color={colors.sidebar} />
          </InputLeftElement>
          <ChakraInput
            ref={ref => (searchRef.current = ref)}
            value={tableState.search}
            type='text'
            placeholder={searchPlaceholder}
            onChange={updateSearchTerm}
          />
          {tableState.search.length > 0 ? (
            <InputRightElement onClick={resetSearchTerm}>
              <CloseIcon />
            </InputRightElement>
          ) : (
            <InputRightElement w='auto' mr={3} pointerEvents='none'>
              <span>
                <Kbd>{isWindows ? 'Ctrl' : 'cmd'}</Kbd> + <Kbd>K</Kbd>
              </span>
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
