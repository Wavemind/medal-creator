/**
 * The external imports
 */
import React, {
  useState,
  useCallback,
  useRef,
  useEffect,
  ChangeEvent,
} from 'react'
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
  Input as ChakraInput,
  InputRightElement,
  InputGroup,
  Box,
} from '@chakra-ui/react'
import filter from 'lodash/filter'
import debounce from 'lodash/debounce'

/**
 * The internal imports
 */
import FormLabel from '@/components/formLabel'
import {
  GetUsers,
  useLazyGetUsersQuery,
} from '@/lib/api/modules/enhanced/user.enhanced'
import { useAppRouter } from '@/lib/hooks'
import type {
  AddUsersToProjectComponent,
  Scalars,
  PaginationObject,
} from '@/types'

const AddUsersToProject: AddUsersToProjectComponent = ({
  allowedUsers,
  setAllowedUsers,
}) => {
  const { t } = useTranslation('project')
  const inputRef = useRef<HTMLInputElement>(null)

  const {
    query: { projectId },
  } = useAppRouter()

  const [unpaginatedUsers, setUnpaginatedUsers] = useState<
    Array<PaginationObject<GetUsers>>
  >([])
  const [foundUsers, setFoundUsers] = useState<
    Array<PaginationObject<GetUsers>>
  >([])
  const [searchTerm, setSearchTerm] = useState('')

  const [getUsers, { data: users, isSuccess }] = useLazyGetUsersQuery()

  /**
   * Fetch projects on search term change
   */
  useEffect(() => {
    getUsers({ projectId, searchTerm })
  }, [searchTerm])

  /**
   * Remove user already allowed
   */
  useEffect(() => {
    if (isSuccess && users) {
      const flattennedUsers: Array<PaginationObject<GetUsers>> =
        users.edges.map(edge => edge.node)
      setUnpaginatedUsers(flattennedUsers)

      const filteredUsers = flattennedUsers.filter(
        user => !allowedUsers.some(allowedUser => allowedUser.id === user.id)
      )

      setFoundUsers(filteredUsers)
    }
  }, [users, allowedUsers])

  /**
   * Toggle admin status
   * @param index number
   */
  const toggleAdminUser = (index: number): void => {
    setAllowedUsers(prev => {
      const tmpElements = [...prev]
      tmpElements[index].isAdmin = !tmpElements[index].isAdmin
      return tmpElements
    })
  }

  /**
   * Remove project from userProject array
   * @param projectId number
   */
  const removeUser = (userId: Scalars['ID']): void => {
    const removedUser = unpaginatedUsers.find(user => user.id === userId)
    if (removedUser) {
      setFoundUsers(prev => [...prev, removedUser])
    }
    setAllowedUsers(prev => filter(prev, u => u.id !== userId))
  }

  /**
   * Add project to userProject array
   * @param projectId number
   */
  const addUser = (userId: Scalars['ID']): void => {
    const newFoundUsers = filter(foundUsers, e => e.id !== userId)
    if (inputRef.current && newFoundUsers.length === 0) {
      inputRef.current.value = ''
    }
    const newUser = unpaginatedUsers.find(user => user.id === userId)
    if (newUser) {
      setAllowedUsers(prev => [...prev, { ...newUser, isAdmin: false }])
    }
    setFoundUsers(newFoundUsers)
  }

  /**
   * Updates the search term and resets the pagination
   * @param {*} e Event object
   */
  const updateSearchTerm = (e: ChangeEvent<HTMLInputElement>): void => {
    setSearchTerm(e.target.value)
  }

  /**
   * Debounces the search update by 0.3 seconds
   */
  const debouncedSearch = useCallback(debounce(updateSearchTerm, 300), [])

  /**
   * Resets the search term
   */
  const resetSearch = (): void => {
    if (inputRef.current) {
      inputRef.current.value = ''
      setSearchTerm('')
    }
  }

  return (
    <React.Fragment>
      <FormControl>
        <FormLabel name='users'>{t('form.searchUser')}</FormLabel>
        <InputGroup>
          <ChakraInput
            ref={inputRef}
            type='text'
            name='users'
            placeholder='John doe | john.doe@email.com'
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
        {searchTerm !== '' &&
          foundUsers.map(user => (
            <Button
              width='full'
              variant='card'
              data-testid='find-users'
              key={`result-${user.id}`}
              onClick={() => addUser(user.id)}
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
              <Box alignItems='flex-start' w='full' textAlign='left'>
                <Text fontSize='lg' noOfLines={1} maxW='95%'>
                  {user.firstName} {user.lastName}
                </Text>
                <Text fontSize='sm' noOfLines={1} maxW='95%'>
                  {user.email}
                </Text>
              </Box>
            </Button>
          ))}
      </SimpleGrid>

      <Text fontWeight='semibold' w='full'>
        {t('form.allowedUser')}
      </Text>
      {allowedUsers.length > 0 ? (
        <SimpleGrid columns={2} spacing={2} w='full'>
          {allowedUsers.map((user, index) => (
            <HStack
              data-testid='allowed-users'
              borderRadius='lg'
              boxShadow='sm'
              height='full'
              border={1}
              borderColor='sidebar'
              p={15}
              key={`allowed-${user.id}`}
            >
              <VStack alignItems='flex-start' w='full'>
                <React.Fragment>
                  <Text fontSize='lg'>
                    {user.firstName} {user.lastName}
                  </Text>
                  <Text fontSize='sm'>{user.email}</Text>
                </React.Fragment>
                <ChakraCheckbox
                  data-testid='toggle-admin-allowed-users'
                  size='sm'
                  isChecked={user.isAdmin}
                  onChange={() => toggleAdminUser(index)}
                >
                  {t('administrator', { ns: 'common' })}
                </ChakraCheckbox>
              </VStack>
              <IconButton
                data-testid='remove-users'
                variant='delete'
                fontSize={12}
                size='xs'
                onClick={() => removeUser(user.id)}
                icon={<CloseIcon />}
                aria-label='remove_project'
              />
            </HStack>
          ))}
        </SimpleGrid>
      ) : (
        <Alert status='info' borderRadius='2xl'>
          <AlertIcon />
          {t('form.nobody')}
        </Alert>
      )}
    </React.Fragment>
  )
}

export default AddUsersToProject
