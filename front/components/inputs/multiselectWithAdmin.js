/**
 * The external imports
 */
import React, { useState, useCallback, useRef } from 'react'
import { useTranslation } from 'next-i18next'
import { AddIcon, CloseIcon } from '@chakra-ui/icons'
import {
  VStack,
  Button,
  HStack,
  Text,
  Checkbox as ChakraCheckbox,
  IconButton,
  SimpleGrid,
  Alert,
  AlertIcon,
  FormControl,
  FormLabel,
  Input as ChakraInput,
  InputRightElement,
  InputGroup,
} from '@chakra-ui/react'
import filter from 'lodash/filter'
import debounce from 'lodash/debounce'

const MultiSelectWithAdmin = ({
  type,
  elements,
  selectedElements,
  setSelectedElements,
  inputLabel,
  inputPlaceholder,
  selectedText,
  cardContent,
  noneSelectedText,
  searchCriteria,
  showAllElementsByDefault = false,
}) => {
  const { t } = useTranslation('common')
  const [elementsFind, setElementsFind] = useState(
    showAllElementsByDefault ? elements : []
  )

  const inputRef = useRef(null)

  /**
   * Search user by first name. last name or email
   * @param {object} e
   */
  const searchElements = e => {
    const term = e.target.value

    if (term === '') {
      setElementsFind(showAllElementsByDefault ? elements : [])
    } else {
      const result = filter(
        elements,
        element =>
          searchCriteria(element, term) &&
          !selectedElements.some(
            selectedElement => selectedElement.id === element.id
          )
      )

      setElementsFind(result)
    }
  }

  /**
   * Toggle admin status
   * @param {userIndex} index
   */
  const toggleAdminUser = index => {
    const tmpElements = [...selectedElements]
    tmpElements[index].isAdmin = !tmpElements[index].isAdmin
    setSelectedElements(tmpElements)
  }

  /**
   * Remove user from allowedUser array
   * @param {object} element
   */
  const removeElement = element => {
    const newElements = filter(selectedElements, u => u.id !== element.id)
    if (inputRef.current.value !== '') {
      const result = filter(
        elements,
        e =>
          searchCriteria(e, inputRef.current.value) &&
          !newElements.some(element => element.id === e.id)
      )

      setElementsFind(result)
    }
    setSelectedElements(newElements)
  }

  /**
   * Add user to allowedUser array
   * @param {object} user
   */
  const addElement = element => {
    const result = filter(elementsFind, e => e.id !== element.id)

    if (result.length === 0) {
      inputRef.current.value = ''
    }

    setSelectedElements(prev => [...prev, { ...element, isAdmin: false }])
    setElementsFind(result)
  }

  /**
   * Debounces the search update by 0.3 seconds
   */
  const debouncedSearch = useCallback(debounce(searchElements, 300), [])

  /**
   * Resets the search bar and options
   */
  const resetSearch = () => {
    inputRef.current.value = ''
    setElementsFind(showAllElementsByDefault ? elements : [])
  }

  return (
    <React.Fragment>
      <FormControl>
        <FormLabel htmlFor={type}>{inputLabel}</FormLabel>
        <InputGroup>
          <ChakraInput
            ref={inputRef}
            type='text'
            name={type}
            placeholder={inputPlaceholder}
            onChange={debouncedSearch}
          />
          {inputRef.current && inputRef.current.value.length > 0 && (
            <InputRightElement onClick={resetSearch}>
              <CloseIcon />
            </InputRightElement>
          )}
        </InputGroup>
      </FormControl>
      <SimpleGrid columns={2} spacing={2} w='full'>
        {elementsFind.map(element => (
          <Button
            width='full'
            variant='card'
            data-cy={`find_${type}`}
            key={`result-${element.id}`}
            onClick={() => addElement(element)}
            rightIcon={
              <AddIcon
                bg='green.400'
                borderRadius='full'
                fontSize={22}
                p={1}
                color='white'
              />
            }
          >
            <VStack alignItems='flex-start' w='full'>
              {cardContent(element)}
            </VStack>
          </Button>
        ))}
      </SimpleGrid>

      <Text fontWeight='semibold' w='full'>
        {selectedText}
      </Text>
      {selectedElements.length > 0 ? (
        <SimpleGrid columns={2} spacing={2} w='full'>
          {selectedElements.map((element, index) => (
            <HStack
              data-cy={`allowed_${type}`}
              borderRadius='lg'
              boxShadow='sm'
              height='full'
              border='1px'
              borderColor='sidebar'
              p={15}
              key={`allowed-${element.id}`}
            >
              <VStack alignItems='flex-start' w='full'>
                {cardContent(element)}
                <ChakraCheckbox
                  data-cy={`toggle_admin_allowed_${type}`}
                  size='sm'
                  value={element.isAdmin}
                  isChecked={element.isAdmin}
                  onChange={() => toggleAdminUser(index)}
                >
                  {t('administrator')}
                </ChakraCheckbox>
              </VStack>
              <IconButton
                variant='delete'
                fontSize={12}
                size='xs'
                onClick={() => removeElement(element)}
                icon={<CloseIcon />}
              />
            </HStack>
          ))}
        </SimpleGrid>
      ) : (
        <Alert status='info'>
          <AlertIcon />
          {noneSelectedText}
        </Alert>
      )}
    </React.Fragment>
  )
}

export default MultiSelectWithAdmin
