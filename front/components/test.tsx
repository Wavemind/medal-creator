import { useState, useRef, useEffect } from 'react'
import { Box, Input, Menu, MenuItem } from '@chakra-ui/react'

const myFuckingArray = [
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
  // Maybe this can be done with a ref value instead of a state to avoid unnecessary re renders ?
  const [caretPosition, setCaretPosition] = useState<number>(0)

  const inputRef = useRef<HTMLInputElement | null>(null) // Create a ref for the input element

  const handleCaretChange = () => {
    if (inputRef.current?.selectionStart) {
      setCaretPosition(inputRef.current.selectionStart)
    }
  }

  const getStartPosition = () => {
    let start = caretPosition

    // Search for the open bracket before the caret
    while (start >= 0 && inputRef.current?.value[start] !== '[') {
      start--
    }

    return start
  }

  const getEndPosition = () => {
    let end = caretPosition

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
      if (event.key === '/') {
        setAutocompleteOptions(defaultActions)
      } else if (['Backspace', ' ', 'Escape'].includes(event.key)) {
        setAutocompleteOptions([])
      } else if (
        caretPosition &&
        event.key.length === 1 &&
        /^[a-zA-Z0-9]+$/.test(event.key)
      ) {
        // 1. Detect if the caret is wrapped by [], either empty or already filled
        const start = getStartPosition()
        const end = getEndPosition()

        // Check if there is a start and end bracket
        if (
          inputRef.current &&
          caretPosition > 0 &&
          caretPosition < inputRef.current.value.length &&
          inputRef.current.value[start] === '[' &&
          inputRef.current.value[end] === ']'
        ) {
          // 2. If so, extract the text that is between those [] and use it to search
          const searchText = inputRef.current.value.substring(start + 1, end)

          const filteredArray = []

          for (const element of myFuckingArray) {
            if (element.toLowerCase().indexOf(searchText.toLowerCase()) > -1) {
              filteredArray.push({ label: element, value: element })
            }
          }
          setAutocompleteOptions(filteredArray)
        }
      }
      handleCaretChange()
    }

    // Add event listeners
    inputRef.current?.addEventListener('keyup', keyboardEvents)
    inputRef.current?.addEventListener('click', handleCaretChange)

    return () => {
      // Remove event listeners when the component unmounts
      inputRef.current?.removeEventListener('keyup', keyboardEvents)
      inputRef.current?.removeEventListener('click', handleCaretChange)
    }
  }, [caretPosition])

  const handleMenuItemClick = (action: string) => {
    if (defaultActions.some(currentAction => currentAction.value === action)) {
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
                _hover={{ bg: 'grey.100' }}
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
