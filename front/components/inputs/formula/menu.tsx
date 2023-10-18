/**
 * The external imports
 */
import { Menu, MenuItem, MenuList } from '@chakra-ui/react'
import type { FC } from 'react'

/**
 * The internal imports
 */
import { useFormula } from '@/lib/hooks/useFormula'

const FormulaMenu: FC = () => {
  const { autocompleteOptions, handleMenuItemClick, inputRef } = useFormula()

  const positionXMenu = () => {
    if (inputRef.current && inputRef.current?.selectionStart) {
      return inputRef.current?.selectionStart * 7.2
    }
    return 0
  }

  return (
    <Menu
      isOpen={autocompleteOptions.length > 0}
      isLazy
      onClose={() => inputRef.current?.focus()}
    >
      <MenuList
        position='absolute'
        bottom='-30px'
        left={`${positionXMenu()}px`}
      >
        {autocompleteOptions.map(option => (
          <MenuItem
            isDisabled={option.value === ''}
            key={option.label}
            onClick={() => handleMenuItemClick(option.value)}
          >
            {option.label}
          </MenuItem>
        ))}
      </MenuList>
    </Menu>
  )
}

export default FormulaMenu
