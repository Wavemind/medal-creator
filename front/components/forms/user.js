/**
 * The external imports
 */
import { useEffect, useContext, useState, useCallback } from 'react'
import { FormProvider, useForm } from 'react-hook-form'
import { useTranslation } from 'next-i18next'
import { VStack, Button, HStack, Box, Text, useConst } from '@chakra-ui/react'
import { yupResolver } from '@hookform/resolvers/yup'
import * as yup from 'yup'

/**
 * The internal imports
 */
import {
  useLazyGetUserQuery,
  useCreateUserMutation,
  useUpdateUserMutation,
} from '/lib/services/modules/user'
import { useToast } from '/lib/hooks'
import { ModalContext } from '/lib/contexts'
import { Input, Select, MultiSelectWithAdmin } from '/components'
import { useGetProjectsQuery } from '/lib/services/modules/project'

const UserForm = ({ id = null }) => {
  const { t } = useTranslation('users')
  const { newToast } = useToast()
  const { closeModal } = useContext(ModalContext)
  const methods = useForm({
    resolver: yupResolver(
      yup.object({
        firstName: yup.string().required(t('required', { ns: 'validations' })),
        lastName: yup.string().required(t('required', { ns: 'validations' })),
        email: yup
          .string()
          .required(t('required', { ns: 'validations' }))
          .email(t('email', { ns: 'validations' })),
        role: yup.number().required(t('required', { ns: 'validations' })),
      })
    ),
    reValidateMode: 'onSubmit',
    defaultValues: {
      firstName: '',
      lastName: '',
      email: '',
      role: '',
    },
  })

  console.log('rendering')

  const [userProjects, setUserProjects] = useState([])

  const { data: projects } = useGetProjectsQuery()
  const [
    getUser,
    {
      data: user,
      isSuccess: isGetUserSuccess,
      isError: isGetUserError,
      error: getUserError,
    },
  ] = useLazyGetUserQuery()

  const [
    createUser,
    {
      isSuccess: isCreateUserSuccess,
      isError: isCreateUserError,
      error: createUserError,
    },
  ] = useCreateUserMutation()

  const [
    updateUser,
    {
      isSuccess: isUpdateUserSuccess,
      isError: isUpdateUserError,
      error: updateUserError,
    },
  ] = useUpdateUserMutation()

  const roleOptions = useConst(() => [
    { key: 'admin', label: t('roles.admin'), value: 0 },
    { key: 'clinician', label: t('roles.clinician'), value: 1 },
    {
      key: 'deployment_manager',
      label: t('roles.deploymentManager'),
      value: 2,
    },
  ])

  /**
   * If the the id prop is provided, get the user with that id
   */
  useEffect(() => {
    if (id) {
      getUser(id)
    }
  }, [])

  /**
   * Reset the form with the existing user data
   */
  useEffect(() => {
    if (isGetUserSuccess) {
      methods.reset({
        firstName: user.firstName,
        lastName: user.lastName,
        email: user.email,
        role: roleOptions.find(option => option.key === user.role).value,
      })
    }
  }, [isGetUserSuccess])

  /**
   * Search criteria to use for project search
   */
  const projectSearchCriteria = useCallback(
    (element, term) =>
      element.name.toLowerCase().indexOf(term.toLowerCase()) > -1
  )

  /**
   * Calls the create user mutation with the form data
   * @param {*} data { firstName, lastName, email }
   */
  const onSubmit = data => {
    const cleanedUserProjects = userProjects.map(project => ({
      projectId: project.id,
      isAdmin: project.isAdmin,
    }))
    if (id) {
      updateUser({
        id,
        ...data,
        userProjectsAttributes: cleanedUserProjects,
      })
    } else {
      createUser({
        ...data,
        userProjectsAttributes: cleanedUserProjects,
      })
    }
  }

  /**
   * If create successful, queue the toast and close the modal
   */
  useEffect(() => {
    if (isCreateUserSuccess) {
      newToast({
        message: t('notifications.createSuccess', { ns: 'common' }),
        status: 'success',
      })
      closeModal()
    }
  }, [isCreateUserSuccess])

  /**
   * If update successful, queue the toast and close the modal
   */
  useEffect(() => {
    if (isUpdateUserSuccess) {
      newToast({
        message: t('notifications.updateSuccess', { ns: 'common' }),
        status: 'success',
      })
      closeModal()
    }
  }, [isUpdateUserSuccess])

  return (
    <FormProvider {...methods}>
      <form onSubmit={methods.handleSubmit(onSubmit)}>
        <VStack alignItems='flex-end' spacing={8}>
          <HStack spacing={4} w='full'>
            <Input name='firstName' label={t('firstName')} isRequired />
            <Input name='lastName' label={t('lastName')} isRequired />
          </HStack>
          <Input name='email' type='email' label={t('email')} isRequired />
          <Select
            label={t('role')}
            options={roleOptions}
            name='role'
            isRequired
          />
          <MultiSelectWithAdmin
            type='projects'
            elements={projects}
            selectedElements={userProjects}
            setSelectedElements={setUserProjects}
            inputLabel={t('addUserProjects')}
            inputPlaceholder={t('searchProjectsPlaceholder')}
            selectedText={t('selectedProjects')}
            cardContent={element => <Text fontSize='md'>{element.name}</Text>}
            noneSelectedText={t('noUserProjects')}
            searchCriteria={projectSearchCriteria}
            showAllElementsByDefault
          />
          {isCreateUserError && (
            <Box w='full'>
              <Text fontSize='m' color='red' data-cy='server_message'>
                {typeof createUserError.message === 'string'
                  ? createUserError.message.split(':')[0]
                  : createUserError.data.errors.join()}
              </Text>
            </Box>
          )}
          {isUpdateUserError && (
            <Box w='full'>
              <Text fontSize='m' color='red' data-cy='server_message'>
                {typeof updateUserError.message === 'string'
                  ? updateUserError.message.split(':')[0]
                  : updateUserError.data.errors.join()}
              </Text>
            </Box>
          )}
          {isGetUserError && (
            <Box w='full'>
              <Text fontSize='m' color='red' data-cy='server_message'>
                {typeof getUserError.message === 'string'
                  ? getUserError.message.split(':')[0]
                  : getUserError.data.errors.join()}
              </Text>
            </Box>
          )}
          <HStack justifyContent='flex-end'>
            <Button
              type='submit'
              data-cy='submit'
              isLoading={methods.formState.isSubmitting}
            >
              {t('save', { ns: 'common' })}
            </Button>
          </HStack>
        </VStack>
      </form>
    </FormProvider>
  )
}

export default UserForm
