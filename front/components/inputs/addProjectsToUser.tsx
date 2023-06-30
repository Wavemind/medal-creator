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
  FormLabel,
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
import { GetProjects, useLazyGetProjectsQuery } from '@/lib/api/modules'
import type {
  AddProjectsToUserComponent,
  PaginationObject,
  Scalars,
} from '@/types'

const AddProjectsToUser: AddProjectsToUserComponent = ({
  userProjects,
  setUserProjects,
}) => {
  const { t } = useTranslation('users')
  const inputRef = useRef<HTMLInputElement>(null)

  const [unpaginatedProjects, setUnpaginatedProject] = useState<
    Array<PaginationObject<GetProjects>>
  >([])
  const [foundProjects, setFoundProjects] = useState<
    Array<PaginationObject<GetProjects>>
  >([])
  const [search, setSearch] = useState('')

  const [getProjects, { data: projects, isSuccess }] = useLazyGetProjectsQuery()

  /**
   * Fetch projects on search term change
   */
  useEffect(() => {
    getProjects({ searchTerm: search })
  }, [search])

  /**
   * Remove user already allowed
   */
  useEffect(() => {
    if (isSuccess && projects) {
      const flattennedProjects: Array<PaginationObject<GetProjects>> = []
      projects.edges.forEach(edge => flattennedProjects.push(edge.node))
      setUnpaginatedProject(flattennedProjects)

      const filteredProjects = flattennedProjects.filter(
        project =>
          !userProjects.some(
            userProject => userProject.projectId === project.id
          )
      )

      setFoundProjects(filteredProjects)
    }
  }, [projects, userProjects])

  /**
   * Toggle admin status
   * @param index number
   */
  const toggleAdminUser = (index: number): void => {
    setUserProjects(prev => {
      const tmpElements = [...prev]
      tmpElements[index].isAdmin = !tmpElements[index].isAdmin
      return tmpElements
    })
  }

  /**
   * Remove project from userProject array
   * @param projectId number
   */
  const removeProject = (projectId: Scalars['ID']): void => {
    const newElements = filter(userProjects, u => u.projectId !== projectId)
    const removedProject = unpaginatedProjects.find(
      project => project.id === projectId
    )
    if (removedProject) {
      setFoundProjects(prev => [...prev, removedProject])
    }
    setUserProjects(newElements)
  }

  /**
   * Add project to userProject array
   * @param projectId number
   */
  const addProject = (projectId: Scalars['ID']): void => {
    const result = filter(foundProjects, e => e.id !== projectId)
    if (inputRef.current && result.length === 0) {
      inputRef.current.value = ''
    }

    setUserProjects(prev => [...prev, { projectId, isAdmin: false }])
    setFoundProjects(result)
  }

  /**
   * Updates the search term and resets the pagination
   * @param {*} e Event object
   */
  const updateSearchTerm = (e: ChangeEvent<HTMLInputElement>): void => {
    setSearch(e.target.value)
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
      setSearch('')
    }
  }

  return (
    <React.Fragment>
      <FormControl>
        <FormLabel htmlFor='projects'>{t('addUserProjects')}</FormLabel>
        <InputGroup>
          <ChakraInput
            ref={inputRef}
            type='text'
            name='projects'
            placeholder={t('searchProjectsPlaceholder')}
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
        {foundProjects.map(project => (
          <Button
            w='full'
            variant='card'
            data-cy='find_projects'
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
            <Box alignItems='flex-start' w='full' textAlign='left'>
              <Text fontSize='md' noOfLines={1} maxW='95%'>
                {project.name}
              </Text>
            </Box>
          </Button>
        ))}
      </SimpleGrid>

      <Text fontWeight='semibold' w='full'>
        {t('selectedProjects')}
      </Text>
      {userProjects.length > 0 ? (
        <SimpleGrid columns={2} spacing={2} w='full'>
          {userProjects.map((userProject, index) => (
            <HStack
              data-cy='allowed_projects'
              borderRadius='lg'
              boxShadow='sm'
              height='full'
              border={1}
              borderColor='sidebar'
              p={15}
              key={`allowed-${userProject.projectId}`}
            >
              <VStack alignItems='flex-start' w='full'>
                <Text fontSize='md'>
                  {
                    unpaginatedProjects.find(
                      project => project.id === userProject.projectId
                    )?.name
                  }
                </Text>
                <ChakraCheckbox
                  data-cy='toggle_admin_allowed_projects'
                  size='sm'
                  isChecked={userProject.isAdmin}
                  onChange={() => toggleAdminUser(index)}
                >
                  {t('administrator', { ns: 'common' })}
                </ChakraCheckbox>
              </VStack>
              <IconButton
                data-cy='remove_projects'
                variant='delete'
                fontSize={12}
                size='xs'
                onClick={() => removeProject(userProject.projectId)}
                icon={<CloseIcon />}
                aria-label='remove_project'
              />
            </HStack>
          ))}
        </SimpleGrid>
      ) : (
        <Alert status='info'>
          <AlertIcon />
          {t('noUserProjects')}
        </Alert>
      )}
    </React.Fragment>
  )
}

export default AddProjectsToUser
