import { useState, useRef, useEffect } from 'react'
import { Input, Menu, MenuItem } from '@chakra-ui/react'

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

function MyComponent() {
  const [inputValue, setInputValue] = useState<string>('')
  const [replaceCursor, setReplaceCursor] = useState<boolean>(false)
  const [autocompleteOptions, setAutocompleteOptions] = useState<
    Array<{ label: string; value: string }>
  >([])

  const inputRef = useRef<HTMLInputElement | null>(null) // Create a ref for the input element

  useEffect(() => {
    // Event listener for "[" key press
    const keyboardEvents = (event: KeyboardEvent) => {
      if (event.key === '/') {
        setAutocompleteOptions([
          { label: 'ToMonth()', value: 'ToMonth()' },
          { label: 'ToDay()', value: 'ToDay()' },
          { label: 'Add variable', value: '[]' },
        ])
      }
      if (['Backspace', ' '].includes(event.key)) {
        setAutocompleteOptions([])
      }
    }

    // Add event listeners
    document.addEventListener('keydown', keyboardEvents)

    return () => {
      // Remove event listeners when the component unmounts
      document.removeEventListener('keydown', keyboardEvents)
    }
  }, [])

  const handleMenuItemClick = (action: string) => {
    const newValue = inputValue.substring(0, inputValue.length - 1) + action // Remove the last slash and concatenate the new action
    setInputValue(newValue) // Update the input value with the selected action
    setAutocompleteOptions([]) // Close the menu
    setReplaceCursor(true)
  }

  useEffect(() => {
    // TODO: Trigger function if cursor is in []
  }, [])

  // Move cursor in () or in []
  useEffect(() => {
    if (replaceCursor && inputRef.current) {
      inputRef.current.setSelectionRange(
        inputValue.length - 1,
        inputValue.length - 1
      )
      inputRef.current.focus()

      console.log('caret at: ', inputRef.current.selectionStart)
      setReplaceCursor(false)
    }
  }, [replaceCursor])

  return (
    <div>
      <Input
        value={inputValue}
        onChange={e => setInputValue(e.target.value)}
        ref={inputRef}
      />
      {autocompleteOptions && (
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
      )}
    </div>
  )
}

export default MyComponent
