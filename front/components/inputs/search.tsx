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
import CloseIcon from '@/assets/icons/Close'
import SearchIcon from '@/assets/icons/Search'
import type { SearchComponent } from '@/types'

const Search: SearchComponent = ({
  updateSearchTerm,
  resetSearchTerm,
  placeholder = undefined,
}) => {
  const { colors } = useTheme()

  const searchRef = useRef<HTMLInputElement | null>(null)
  const [isMacOS, setIsMacOS] = useState(true)

  /**
   * Check if the user is on Windows or MacOS
   */
  useEffect(() => {
    setIsMacOS(/(Mac|iPhone|iPod|iPad)/i.test(navigator.platform))
  }, [])

  /**
   * Sets an event listener to listen for the Meta/Ctrl + K combination
   * On combination press, focus the search input
   */
  useEffect(() => {
    const handleKeyDown = (e: unknown) => {
      const keyboardEvent = e as KeyboardEvent<Document>
      if (
        (isMacOS && keyboardEvent.metaKey && keyboardEvent.which === 75) ||
        (!isMacOS && keyboardEvent.ctrlKey && keyboardEvent.which === 75)
      ) {
        searchRef.current?.focus()
        keyboardEvent.preventDefault()
      }
    }

    document.addEventListener('keydown', handleKeyDown)

    return () => {
      document.removeEventListener('keydown', handleKeyDown)
    }
  }, [isMacOS])

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
            <Kbd>{isMacOS ? '⌘' : 'Ctrl'}</Kbd> + <Kbd>K</Kbd>
          </span>
        </InputRightElement>
      )}
    </InputGroup>
  )
}

export default Search
