/**
 * The external imports
 */
import { useTranslation } from 'next-i18next'
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

const Input = ({ search, setSearch }) => {
  const { colors } = useTheme()
  const { t } = useTranslation('datatable')

  return (
    <InputGroup>
      <InputLeftElement
        pointerEvents='none'
        children={<SearchIcon color={colors.sidebar} />}
      />
      <ChakraInput
        value={search.term}
        type='text'
        // TODO Get the placeholder dynamically depending on what the table holds and then translate it
        placeholder='Search XXXX'
        onChange={e => setSearch({ term: e.target.value, selected: false })}
      />
      {search.term.length > 0 && (
        <InputRightElement
          onClick={() => setSearch({ term: '', selected: false })}
          children={<CloseIcon />}
        />
      )}
    </InputGroup>
  )
}

export default Input
