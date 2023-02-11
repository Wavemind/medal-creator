/**
 * The external imports
 */
import React, { useState, useCallback, useRef, useEffect, FC, ReactElement } from 'react'
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

/**
 * Type definitions
 */
// TODO : Edge devrait certainement aller dans les types RTK,
// mais a voir comment on peut generaliser la structure
interface Edge {
  node: Element
}

interface Element {
  id: number
  isAdmin: boolean
}

interface Props {
  type: string
  selectedElements: Element[]
  setSelectedElements: React.Dispatch<React.SetStateAction<Element[]>>
  inputLabel: string
  inputPlaceholder: string
  // TODO : Trouver quelle type utiliser pour apiQuery qui est du style useLazy...
  apiQuery: React.Dispatch<React.SetStateAction<string>>
  selectedText: string
  cardContent: (el: Element) => ReactElement
  noneSelectedText: string
  showAllElementsByDefault?: boolean
}

const MultiSelectWithAdmin: FC<Props> = ({
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
  const inputRef = useRef<HTMLInputElement>(null)

  const [elementsFind, setElementsFind] = useState<Edge[]>([])
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
      const tmpElements = data.edges.filter((edge: Edge) => {
        return !selectedElements.some(element => element.id === edge.node.id)
      })

      setElementsFind(tmpElements)
    }
  }, [data, selectedElements])

  /**
   * Toggle admin status
   * @param {userIndex} index
   */
  const toggleAdminUser = (index: number) => {
    const tmpElements = [...selectedElements]
    tmpElements[index].isAdmin = !tmpElements[index].isAdmin
    setSelectedElements(tmpElements)
  }

  /**
   * Remove user from allowedUser array
   * @param {object} element
   */
  const removeElement = (element: Element) => {
    const newElements = filter(selectedElements, u => u.id !== element.id)
    setElementsFind(prev => [...prev, { node: element }])
    setSelectedElements(newElements)
  }

  /**
   * Add user to allowedUser array
   * @param {object} user
   */
  const addElement = (element: Element) => {
    const result = filter(elementsFind, e => e.node.id !== element.id)
    // Besoin d'ajouter le check de inputRef.current ici comme type guard
    if (inputRef.current && result.length === 0) {
      inputRef.current.value = ''
    }
    setSelectedElements(prev => [...prev, { ...element, isAdmin: false }])
    setElementsFind(result)
  }

  /**
   * Updates the search term and resets the pagination
   * @param {*} e Event object
   */
  const updateSearchTerm = (e: React.ChangeEvent<HTMLInputElement>) => {
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
    // Besoin d'ajouter le check de inputRef.current ici comme type guard
    if (inputRef.current) {
      inputRef.current.value = ''
      setSearch('')
    }
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
        {(showAllElementsByDefault || search !== '') &&
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
                  // TODO : Check if value prop is needed on Checkbox when we have isChecked
                  value={element.isAdmin}
                  isChecked={element.isAdmin}
                  onChange={() => toggleAdminUser(index)}
                >
                  {t('administrator')}
                </ChakraCheckbox>
              </VStack>
              <IconButton
                data-cy={`remove_${type}`}
                variant='delete'
                fontSize={12}
                size='xs'
                onClick={() => removeElement(element)}
                icon={<CloseIcon />}
                aria-label={`remove_${type}`}
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
