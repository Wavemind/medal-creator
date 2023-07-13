/**
 * The external imports
 */
import {
  useEffect,
  useRef,
  useState,
  useCallback,
  type KeyboardEvent,
} from 'react'
import debounce from 'lodash/debounce'
import {
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
import { CloseIcon, SearchIcon } from '@/assets/icons'
import type { SearchComponent } from '@/types'

const Search: SearchComponent = ({
  updateSearchTerm,
  resetSearchTerm,
  placeholder = undefined,
}) => {
  const { colors } = useTheme()

  const searchRef = useRef<HTMLInputElement | null>(null)
  const [isWindows, setIsWindows] = useState(true)

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
   * Debounces the search update by 0.3 seconds
   */
  const debouncedChangeHandler = useCallback(
    debounce(updateSearchTerm, 300),
    []
  )

  const reset = () => {
    resetSearchTerm()
    if (searchRef.current) {
      searchRef.current.value = ''
    }
  }

  return (
    <InputGroup>
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
        placeholder={placeholder}
        onChange={debouncedChangeHandler}
      />
      {searchRef.current?.value && searchRef.current?.value.length > 0 ? (
        <InputRightElement onClick={reset}>
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
  )
}

export default Search
