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

const FormulaProvider: FC<PropsWithChildren> = ({ children }) => {
  const [inputValue, setInputValue] = useState<string>('')
  const [replaceCursor, setReplaceCursor] = useState<boolean>(false)
  const [autocompleteOptions, setAutocompleteOptions] =
    useState<AutocompleteProps>([])

  const caretPositionRef = useRef(0)
  const inputRef = useRef<HTMLInputElement>(null)

  const handleCaretChange = () => {
    if (inputRef.current?.selectionStart) {
      caretPositionRef.current = inputRef.current.selectionStart
    }
  }

  const getStartPosition = () => {
    let start = caretPositionRef.current

    // Search for the open bracket before the caret
    while (start >= 0 && inputRef.current?.value[start] !== '[') {
      start--
    }

    return start
  }

  const getEndPosition = () => {
    let end = caretPositionRef.current

    // Search for the close bracket after the caret
    while (
      inputRef.current?.value.length &&
      end < inputRef.current.value.length &&
      inputRef.current.value[end] !== ']'
    ) {
      end++
    }

    return end
  }

  // TODO: Catch if user reset a previous []
  const handleMenuItemClick = (action: string) => {
    if (
      DEFAULT_FORMULA_ACTIONS.some(
        currentAction => currentAction.value === action
      )
    ) {
      const newValue = inputValue.substring(0, inputValue.length - 1) + action // Remove the last slash and concatenate the new action
      setInputValue(newValue) // Update the input value with the selected action
      setReplaceCursor(true)
    } else {
      // 1. Detect if the caret is wrapped by [], either empty or already filled
      const start = getStartPosition()
      const end = getEndPosition()

      const searchText = inputRef.current?.value.substring(start + 1, end)

      console.log('searchText', searchText)

      if (searchText) {
        const newInputValue = inputValue.replace(searchText, action)
        // Need to replace content inside [] by action value
        setInputValue(newInputValue)
      }
    }
    setAutocompleteOptions([]) // Close the menu
  }

  useEffect(() => {
    if (autocompleteOptions.length === 0) {
      inputRef.current?.focus()
    }
  }, [autocompleteOptions])

  const searchElements = () => {
    // 1. Detect if the caret is wrapped by [], either empty or already filled
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

  useEffect(() => {
    // Keyboard event we need to detect :
    // 1. '/' to open the function menu => OK
    // 2. 'Backspace' or ' ' to close the menu => OK
    // 3. Left, right, top and bottom arrow keys to detect caret position => OK
    // 4. +, -, /, * as mathematical operators
    // 5. Normal typing inside of [] and ()
    // Other events we need to detect
    // 1. Input focus to detect caret position => OK
    const keyboardEvents = (event: KeyboardEvent) => {
      handleCaretChange()
      if (event.key === '/') {
        setAutocompleteOptions(DEFAULT_FORMULA_ACTIONS)
      } else if ([' ', 'Escape'].includes(event.key)) {
        setAutocompleteOptions([])
      } else if (event.key === 'Backspace') {
        // Improve this to only close the menu if the defaultOptions are visible
        // Otherwise continue the search
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

  // Move cursor in () or in []
  useEffect(() => {
    if (replaceCursor && inputRef.current) {
      inputRef.current.setSelectionRange(
        inputValue.length - 1,
        inputValue.length - 1
      )
      inputRef.current.focus()

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
