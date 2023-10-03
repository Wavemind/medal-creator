/**
 * The external imports
 */
import {
  type FC,
  type PropsWithChildren,
  useEffect,
  useRef,
  useState,
} from 'react'

/**
 * The internal imports
 */
import { FormulaContext } from '@/lib/contexts'
import {
  DEFAULT_FORMULA_ACTIONS,
  ESCAPE_FORMULA_ACTIONS,
} from '@/lib/config/constants'
import { useLazyGetVariablesQuery } from '@/lib/api/modules/enhanced/variable.enhanced'
import { useAppRouter } from '@/lib/hooks'
import { extractTranslation } from '@/lib/utils/string'
import { useGetProjectQuery } from '@/lib/api/modules/enhanced/project.enhanced'
import type { AutocompleteProps } from '@/types'

// TODO : Transform the formula before sending it to the back ?
// TODO : Transform existing formula to fit the input
const FormulaProvider: FC<PropsWithChildren> = ({ children }) => {
  const {
    query: { projectId },
  } = useAppRouter()

  const [inputValue, setInputValue] = useState<string>('')
  const [replaceCursor, setReplaceCursor] = useState<boolean>(false)
  const [autocompleteOptions, setAutocompleteOptions] =
    useState<AutocompleteProps>([])
  const [search, setSearch] = useState('')

  const caretPositionRef = useRef(0)
  const inputRef = useRef<HTMLInputElement>(null)

  const [getVariables, { data: variables, isSuccess }] =
    useLazyGetVariablesQuery()

  const { data: project } = useGetProjectQuery({
    id: projectId,
  })

  /**
   * Sets the current caret position to the ref
   */
  const handleCaretChange = () => {
    if (inputRef.current?.selectionStart) {
      caretPositionRef.current = inputRef.current.selectionStart
    }
  }

  /**
   * Search for the open bracket before the caret
   */
  const getStartPosition = () => {
    let start = caretPositionRef.current

    while (start >= 0 && inputRef.current?.value[start] !== '[') {
      start--
    }

    return start
  }

  /**
   * Search for the close bracket after the caret
   */
  const getEndPosition = () => {
    let end = caretPositionRef.current

    while (
      inputRef.current?.value.length &&
      end < inputRef.current.value.length &&
      inputRef.current.value[end] !== ']'
    ) {
      end++
    }

    return end
  }

  /**
   * Handles when an option is selected from the menu
   */
  const handleMenuItemClick = (action: string) => {
    let newInputValue = ''
    let startPosition = 0

    if (DEFAULT_FORMULA_ACTIONS.some(act => act.value === action)) {
      startPosition = caretPositionRef.current - 1
      setReplaceCursor(true)
    } else {
      startPosition = getStartPosition() + 1
    }

    newInputValue =
      inputValue.substring(0, startPosition) +
      action +
      inputValue.substring(caretPositionRef.current, inputValue.length)

    caretPositionRef.current = (
      inputValue.substring(0, startPosition) + action
    ).length

    setInputValue(newInputValue)
    setAutocompleteOptions([])
  }

  /**
   * Fill the autocomplete with options that match the text between the []
   */
  const searchElements = () => {
    // 1. Detect if the caret is wrapped by []
    const start = getStartPosition()
    const end = getEndPosition()

    // Check if there is a start and end bracket
    if (
      inputRef.current &&
      caretPositionRef.current > 0 &&
      caretPositionRef.current < inputRef.current.value.length &&
      inputRef.current.value[start] === '[' &&
      inputRef.current.value[end] === ']'
    ) {
      // 2. If so, extract the text that is between those [] and use it to search
      const searchText = inputRef.current.value.substring(start + 1, end)

      if (searchText.length > 0) {
        setSearch(searchText)
      } else {
        setAutocompleteOptions([])
      }
    }
  }

  /**
   * Define and initialize the keyboard events to be tracked
   */
  useEffect(() => {
    const keyboardEvents = (event: KeyboardEvent) => {
      handleCaretChange()
      if (event.key === '/') {
        setAutocompleteOptions(DEFAULT_FORMULA_ACTIONS)
      } else if (
        [ESCAPE_FORMULA_ACTIONS.Space, ESCAPE_FORMULA_ACTIONS.Escape].includes(
          event.key as ESCAPE_FORMULA_ACTIONS
        )
      ) {
        setAutocompleteOptions([])
      } else if (event.key === ESCAPE_FORMULA_ACTIONS.Backspace) {
        if (
          autocompleteOptions.some(
            act => act.value === DEFAULT_FORMULA_ACTIONS[0].label
          )
        ) {
          setAutocompleteOptions([])
        } else {
          searchElements()
        }
      } else if (/^[a-zA-Z0-9]$/.test(event.key)) {
        searchElements()
      }
    }

    // Add event listeners
    inputRef.current?.addEventListener('keyup', keyboardEvents)
    inputRef.current?.addEventListener('click', handleCaretChange)

    return () => {
      // Remove event listeners when the component unmounts
      inputRef.current?.removeEventListener('keyup', keyboardEvents)
      inputRef.current?.removeEventListener('click', handleCaretChange)
    }
  }, [])

  /**
   * Fetch projects on search term change
   */
  useEffect(() => {
    if (search.length > 0) {
      getVariables({ projectId, searchTerm: search, first: 5 })
    }
  }, [search, projectId])

  /**
   * Transform the variables to be displayable by the menu
   */
  useEffect(() => {
    if (isSuccess && variables) {
      const results = variables.edges.map(variable => ({
        label: `${variable.node.fullReference} - ${extractTranslation(
          variable.node.labelTranslations,
          project?.language.code
        )}`,
        value: variable.node.fullReference,
      }))
      setAutocompleteOptions(results)
    }
  }, [variables])

  /**
   * Move cursor to between the () or []
   */
  useEffect(() => {
    if (replaceCursor && inputRef.current) {
      inputRef.current.setSelectionRange(
        caretPositionRef.current - 1,
        caretPositionRef.current - 1
      )

      setReplaceCursor(false)

      handleCaretChange()
    }
  }, [replaceCursor])

  return (
    <FormulaContext.Provider
      value={{
        inputRef,
        autocompleteOptions,
        setAutocompleteOptions,
        inputValue,
        setInputValue,
        handleMenuItemClick,
      }}
    >
      {children}
    </FormulaContext.Provider>
  )
}

export default FormulaProvider
