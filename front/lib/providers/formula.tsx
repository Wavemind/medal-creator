/**
 * The external imports
 */
import { FC, PropsWithChildren, useEffect, useRef, useState } from 'react'

/**
 * The internal imports
 */
import { FormulaContext } from '@/lib/contexts'
import { DEFAULT_FORMULA_ACTIONS } from '@/lib/config/constants'
import type { AutocompleteProps } from '@/types'

const myArray = [
  'Alain',
  'Toni',
  'Colin',
  'Manu',
  'Sinan',
  'Laura',
  'Olivia',
  'Tania',
  'Sherlock',
  'Boom',
  'MJ',
]

// TODO : Connect to the back to get the real variables
// TODO : Validate if the formula is valid ? All brackets and parentheses open and closed ?
// TODO : Transform the formula before sending it to the back ?
// TODO : Replace the [Sinan], etc with tags ?
// TODO : Use the arrow keys to navigate the menu when it is open
// TODO : Enter key to select an option ?
// TODO : Transform existing formula to fit the input
// TODO: Autocomplet with default actions
const FormulaProvider: FC<PropsWithChildren> = ({ children }) => {
  const [inputValue, setInputValue] = useState<string>('')
  const [replaceCursor, setReplaceCursor] = useState<boolean>(false)
  const [autocompleteOptions, setAutocompleteOptions] =
    useState<AutocompleteProps>([])

  const caretPositionRef = useRef(0)
  const inputRef = useRef<HTMLInputElement>(null)

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

      const filteredArray = []

      for (const element of myArray) {
        if (element.toLowerCase().indexOf(searchText.toLowerCase()) > -1) {
          filteredArray.push({ label: element, value: element })
        }
      }
      setAutocompleteOptions(filteredArray)
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
      } else if ([' ', 'Escape'].includes(event.key)) {
        setAutocompleteOptions([])
      } else if (event.key === 'Backspace') {
        // TODO : Improve this condition
        if (autocompleteOptions.some(act => act.value === 'Add variable')) {
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

  /**
   * Refocus the input if the menu closes
   */
  useEffect(() => {
    if (autocompleteOptions.length === 0) {
      inputRef.current?.focus()
    }
  }, [autocompleteOptions])

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
