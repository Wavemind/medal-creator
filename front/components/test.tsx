import { useState, useRef, useEffect } from 'react'
import { Box, Input, Menu, MenuItem } from '@chakra-ui/react'

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

const defaultActions = [
  { label: 'ToMonth()', value: 'ToMonth()' },
  { label: 'ToDay()', value: 'ToDay()' },
  { label: 'Add variable', value: '[]' },
]

function MyComponent() {
  const [inputValue, setInputValue] = useState<string>('')
  const [replaceCursor, setReplaceCursor] = useState<boolean>(false)
  const [autocompleteOptions, setAutocompleteOptions] = useState<
    Array<{ label: string; value: string }>
  >([])
  const caretPosition = useRef(0)

  const inputRef = useRef<HTMLInputElement | null>(null) // Create a ref for the input element

  const handleCaretChange = () => {
    if (inputRef.current?.selectionStart) {
      caretPosition.current = inputRef.current.selectionStart
    }
  }

  const getStartPosition = () => {
    let start = caretPosition.current

    // Search for the open bracket before the caret
    while (start >= 0 && inputRef.current?.value[start] !== '[') {
      start--
    }

    return start
  }

  const getEndPosition = () => {
    let end = caretPosition.current

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
      caretPosition.current > 0 &&
      caretPosition.current < inputRef.current.value.length &&
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
    // Left, right, top and bottom arrow keys move the caret AND navigate in the open menu ?
    const keyboardEvents = (event: KeyboardEvent) => {
      handleCaretChange()
      if (event.key === '/') {
        setAutocompleteOptions(defaultActions)
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

  const handleMenuItemClick = (action: string) => {
    if (defaultActions.some(currentAction => currentAction.value === action)) {
      const newValue =
        inputValue.substring(0, caretPosition.current - 1) +
        action +
        inputValue.substring(caretPosition.current, inputValue.length) // Remove the last slash and concatenate the new action
      setInputValue(newValue) // Update the input value with the selected action
      setReplaceCursor(true)
    } else {
      // 1. Detect if the caret is wrapped by [], either empty or already filled
      const start = getStartPosition()
      const end = getEndPosition()

      const searchText = inputRef.current?.value.substring(start + 1, end)

      if (searchText) {
        const newInputValue = inputValue.replace(searchText, action)
        // Need to replace content inside [] by action value
        setInputValue(newInputValue)
      }
    }
    setAutocompleteOptions([]) // Close the menu
  }

  // Move cursor in () or in []
  // TODO : Fix this to make it work for all positions
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
    <Box position='relative'>
      <Input
        value={inputValue}
        onChange={e => setInputValue(e.target.value)}
        ref={inputRef}
      />
      {autocompleteOptions.length > 0 && (
        <Box
          position='absolute'
          w='full'
          bg='white'
          borderRadius='md'
          zIndex={99}
          boxShadow='sm'
          outline='2px solid transparent'
          outlineOffset='2px'
          borderWidth='1px'
          transform='translate(0, 5px)'
        >
          <Menu>
            {autocompleteOptions.map(option => (
              <MenuItem
                onClick={() => handleMenuItemClick(option.value)}
                key={option.label}
              >
                {option.label}
              </MenuItem>
            ))}
          </Menu>
        </Box>
      )}
    </Box>
  )
}

export default MyComponent
