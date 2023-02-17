/**
 * The external imports
 */
import React, {
  useState,
  useCallback,
  useRef,
  useEffect,
  FC,
  ChangeEvent,
  Dispatch,
  SetStateAction,
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
  FormLabel,
  Input as ChakraInput,
  InputRightElement,
  InputGroup,
} from '@chakra-ui/react'
import filter from 'lodash/filter'
import debounce from 'lodash/debounce'

/**
 * The internal imports
 */
import { useLazyGetUsersQuery } from '@/lib/services/modules/user'
import type { Paginated } from '@/types/common'
import type { User } from '@/types/user'

/**
 * Type definitions
 */
type AddUsersToProjectProps = {
  allowedUsers: (User & {
    userProjectId: number
    isAdmin: boolean
  })[]
  setAllowedUsers: Dispatch<SetStateAction<(User & {
    userProjectId: number
    isAdmin: boolean
  })[]>>
}

const AddUsersToProject: FC<AddUsersToProjectProps> = ({
  allowedUsers,
  setAllowedUsers,
}) => {
  const { t } = useTranslation('project')
  const inputRef = useRef<HTMLInputElement>(null)
  const unpaginatedProjectsRef = useRef<User[]>([])

  const [foundProjects, setFoundProjects] = useState<User[]>([])
  const [search, setSearch] = useState('')

  const [getUsers, { data: users = {} as Paginated<User>, isSuccess }] =
    useLazyGetUsersQuery()

  /**
   * Fetch projects on search term change
   */
  useEffect(() => {
    getUsers({ search })
  }, [search])

  /**
   * Remove user already allowed
   */
  useEffect(() => {
    if (isSuccess) {
      const flattennedUsers: User[] = []
      users.edges.forEach(edge => flattennedUsers.push(edge.node))
      // TODO : I don't know if it's right to do this, mais
      // j'ai pas besoin d'un state update, juste le stockage des unpaginated projects
      unpaginatedProjectsRef.current = flattennedUsers

      const filteredProjects = flattennedUsers.filter(
        project => !allowedUsers.some(user => user.projectId === project.id)
      )

      setFoundProjects(filteredProjects)
    }
  }, [users, allowedUsers])

  /**
   * Toggle admin status
   * @param index number
   */
  const toggleAdminUser = (index: number) => {
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
  const removeProject = (projectId: number) => {
    const newElements = filter(allowedUsers, u => u.projectId !== projectId)
    const removedProject = unpaginatedProjectsRef.current.find(
      project => project.id === projectId
    )
    if (removedProject) {
      setFoundProjects(prev => [...prev, removedProject])
    }
    setAllowedUsers(newElements)
  }

  /**
   * Add project to userProject array
   * @param projectId number
   */
  const addProject = (projectId: number) => {
    const result = filter(foundProjects, e => e.id !== projectId)
    if (inputRef.current && result.length === 0) {
      inputRef.current.value = ''
    }
    setAllowedUsers(prev => [...prev, { projectId, isAdmin: false }])
    setFoundProjects(result)
  }

  /**
   * Updates the search term and resets the pagination
   * @param {*} e Event object
   */
  const updateSearchTerm = (e: ChangeEvent<HTMLInputElement>) => {
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
    if (inputRef.current) {
      inputRef.current.value = ''
      setSearch('')
    }
  }

  return (
    <React.Fragment>
      <FormControl>
        <FormLabel htmlFor='projects'>{t('form.searchUser')}</FormLabel>
        <InputGroup>
          <ChakraInput
            ref={inputRef}
            type='text'
            name='projects'
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
        {search !== '' && foundProjects.map(project => (
          <Button
            width='full'
            variant='card'
            data-cy='find_users'
            key={`result-${project.id}`}
            onClick={() => addProject(project.id)}
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
              <Text fontSize='md'>{project.name}</Text>
            </VStack>
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
              data-cy='allowed_users'
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
                  <Text>{user.email}</Text>
                </React.Fragment>
                <ChakraCheckbox
                  data-cy='toggle_admin_allowed_users'
                  size='sm'
                  isChecked={user.isAdmin}
                  onChange={() => toggleAdminUser(index)}
                >
                  {t('administrator', { ns: 'common' })}
                </ChakraCheckbox>
              </VStack>
              <IconButton
                data-cy='remove_users'
                variant='delete'
                fontSize={12}
                size='xs'
                onClick={() => removeProject(user.projectId)}
                icon={<CloseIcon />}
                aria-label='remove_project'
              />
            </HStack>
          ))}
        </SimpleGrid>
      ) : (
        <Alert status='info'>
          <AlertIcon />
          {t('form.nobody')}
        </Alert>
      )}
    </React.Fragment>
  )
}

export default AddUsersToProject
