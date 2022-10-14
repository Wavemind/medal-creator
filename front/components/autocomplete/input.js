/**
 * The external imports
 */
import {
  Input as ChakraInput,
  InputGroup,
  InputLeftElement,
  InputRightElement,
  useTheme,
} from '@chakra-ui/react'

/**
 * The internal imports
 */
import { CloseIcon, SearchIcon } from '../../assets/icons'

const Input = ({ search, searchPlaceholder, setSearch }) => {
  const { colors } = useTheme()

  return (
    <InputGroup>
      <InputLeftElement pointerEvents='none'>
        <SearchIcon color={colors.sidebar} />
      </InputLeftElement>
      <ChakraInput
        value={search.term}
        type='text'
        // TODO Get the placeholder dynamically depending on what the table holds and then translate it
        placeholder={searchPlaceholder}
        onChange={e => setSearch({ term: e.target.value, selected: false })}
      />
      {search.term.length > 0 && (
        <InputRightElement
          onClick={() => setSearch({ term: '', selected: false })}
        >
          <CloseIcon />
        </InputRightElement>
      )}
    </InputGroup>
  )
}

export default Input
