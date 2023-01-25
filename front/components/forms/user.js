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
import { useLazyGetProjectsQuery } from '/lib/services/modules/project'

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

  const [userProjects, setUserProjects] = useState([])

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

      setUserProjects(
        user.userProjects.map(userProject => ({
          userProjectId: userProject.id,
          isAdmin: userProject.isAdmin,
          id: userProject.projectId,
          name: userProject.project.name,
        }))
      )
    }
  }, [isGetUserSuccess])

  /**
   * Calls the create user mutation with the form data
   * @param {*} data { firstName, lastName, email }
   */
  const onSubmit = data => {
    if (id) {
      const cleanedUserProjects = user.userProjects.map(previousUserProject => {
        const foundUserProject = userProjects.find(
          userProject => userProject.userProjectId === previousUserProject.id
        )
        if (!foundUserProject) {
          // Existing but removed
          return {
            id: previousUserProject.id,
            projectId: previousUserProject.projectId,
            isAdmin: previousUserProject.isAdmin,
            _destroy: true,
          }
        }
        // Existing and no change
        return {
          id: previousUserProject.id,
          projectId: previousUserProject.projectId,
          isAdmin: foundUserProject.isAdmin,
        }
      })

      userProjects.forEach(userProject => {
        const foundUserProject = cleanedUserProjects.find(
          cleanedUserProject =>
            cleanedUserProject.id === userProject.userProjectId
        )
        if (!foundUserProject) {
          cleanedUserProjects.push({
            projectId: userProject.id,
            isAdmin: userProject.isAdmin,
          })
        }
      })

      updateUser({
        id,
        ...data,
        userProjectsAttributes: cleanedUserProjects,
      })
    } else {
      const cleanedUserProjects = userProjects.map(userProject => ({
        projectId: userProject.id,
        isAdmin: userProject.isAdmin,
      }))

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

  /**
   * Information display
   */
  const userRow = useCallback(row => <Text fontSize='md'>{row.name}</Text>)

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
            apiQuery={useLazyGetProjectsQuery}
            selectedElements={userProjects}
            setSelectedElements={setUserProjects}
            inputLabel={t('addUserProjects')}
            inputPlaceholder={t('searchProjectsPlaceholder')}
            selectedText={t('selectedProjects')}
            cardContent={userRow}
            noneSelectedText={t('noUserProjects')}
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
