/**
 * The external imports
 */
import React, { useState, useCallback, useRef, useEffect } from 'react'
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
  selectedElements,
  setSelectedElements,
  inputLabel,
  inputPlaceholder,
  apiQuery,
  selectedText,
  cardContent,
  noneSelectedText,
  showAllElementsByDefault = false,
}) => {
  const { t } = useTranslation('common')
  const inputRef = useRef(null)

  const [elementsFind, setElementsFind] = useState([])
  const [search, setSearch] = useState('')

  const [getData, { data, isSuccess }] = apiQuery()

  /**
   * Fetch data search term change
   */
  useEffect(() => {
    getData({
      search,
    })
  }, [search])

  /**
   * Remove user already allowed
   */
  useEffect(() => {
    if (isSuccess) {
      const tmpElements = data.edges.filter(item => {
        return !selectedElements.some(element => element.id === item.node.id)
      })

      setElementsFind(tmpElements)
    }
  }, [data])

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
    setElementsFind(prev => [...prev, { node: element }])
    setSelectedElements(newElements)
  }

  /**
   * Add user to allowedUser array
   * @param {object} user
   */
  const addElement = element => {
    const result = filter(elementsFind, e => e.node.id !== element.id)
    if (result.length === 0) {
      inputRef.current.value = ''
    }
    setSelectedElements(prev => [...prev, { ...element, isAdmin: false }])
    setElementsFind(result)
  }

  /**
   * Updates the search term and resets the pagination
   * @param {*} e Event object
   */
  const updateSearchTerm = e => {
    setSearch(e.target.value)
  }

  /**
   * Debounces the search update by 0.3 seconds
   */
  const debouncedSearch = useCallback(debounce(updateSearchTerm, 300), [])

  /**
   * Resets the search term
   */
  const resetSearch = () => {
    inputRef.current.value = ''
    setSearch('')
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
        {showAllElementsByDefault ||
          (search !== '' &&
            elementsFind.map(element => (
              <Button
                width='full'
                variant='card'
                data-cy={`find_${type}`}
                key={`result-${element.node.id}`}
                onClick={() => addElement(element.node)}
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
                  {cardContent(element.node)}
                </VStack>
              </Button>
            )))}
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
              border={1}
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
