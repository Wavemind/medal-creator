/**
 * The external imports
 */
import {
  useEffect,
  useMemo,
  useRef,
  useState,
  useCallback,
  FC,
  KeyboardEvent,
  ChangeEvent,
} from 'react'
import { useTranslation } from 'next-i18next'
import debounce from 'lodash/debounce'
import {
  Button,
  Menu,
  MenuButton,
  MenuList,
  MenuItem,
  HStack,
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
import { SortIcon, CloseIcon, SearchIcon } from '@/assets/icons'
import { TableColumns } from '@/lib/config/tableColumns'
import type { ToolbarProps } from '@/types/datatable'

const Toolbar: FC<ToolbarProps> = ({
  sortable,
  source,
  searchable,
  searchPlaceholder,
  tableState,
  setTableState,
}) => {
  const { t } = useTranslation('datatable')
  const { colors } = useTheme()
  const searchRef = useRef<HTMLInputElement | null>(null)
  const [isWindows, setIsWindows] = useState(true)

  /**
   * Filters the columns to keep only the sortable ones
   */
  const sortableColumns = useMemo(
    () => TableColumns[source].filter(col => col.sortable),
    []
  )

  /**
   * Check if the user is on Windows or MacOS
   */
  useEffect(() => {
    setIsWindows(navigator.platform.indexOf('Win') > -1)
  }, [])

  /**
   * Sets an event listener to listen for the Meta/Ctrl + K combination
   * On combination press, focus the search input
   */
  useEffect(() => {
    const handleKeyDown = (e: unknown) => {
      const keyboardEvent = e as KeyboardEvent<Document>
      if (
        (!isWindows && keyboardEvent.metaKey && keyboardEvent.which === 75) ||
        (isWindows && keyboardEvent.ctrlKey && keyboardEvent.which === 75)
      ) {
        searchRef.current?.focus()
        keyboardEvent.preventDefault()
      }
    }

    document.addEventListener('keydown', handleKeyDown)

    return () => {
      document.removeEventListener('keydown', handleKeyDown)
    }
  }, [isWindows])

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
   * Debounces the search update by 0.3 seconds
   */
  const debouncedChangeHandler = useCallback(
    debounce(updateSearchTerm, 300),
    []
  )

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
    if (searchRef.current) {
      searchRef.current.value = ''
    }
  }

  return (
    <HStack align='center' justify='space-between' pl={6} py={10} px={10}>
      {searchable && (
        <InputGroup w='30%'>
          <InputLeftElement pointerEvents='none'>
            <SearchIcon color={colors.primary} />
          </InputLeftElement>
          <ChakraInput
            boxShadow='none'
            border='2px'
            borderColor='gray.100'
            ref={searchRef}
            type='text'
            name='search'
            placeholder={searchPlaceholder}
            onChange={debouncedChangeHandler}
          />
          {tableState.search.length > 0 ? (
            <InputRightElement onClick={resetSearchTerm}>
              <CloseIcon />
            </InputRightElement>
          ) : (
            <InputRightElement w='auto' mr={3} pointerEvents='none'>
              <span>
                <Kbd>{isWindows ? 'Ctrl' : '⌘'}</Kbd> + <Kbd>K</Kbd>
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
              <MenuItem key={col.accessorKey} onClick={handleSort}>
                {t(`${source}.${col.accessorKey}`)}
              </MenuItem>
            ))}
          </MenuList>
        </Menu>
      )}
    </HStack>
  )
}

export default Toolbar
