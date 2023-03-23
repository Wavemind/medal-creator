/**
 * The external imports
 */
import { useEffect, useContext, useState, FC } from 'react'
import { useForm } from 'react-hook-form'
import { useTranslation } from 'next-i18next'
import { VStack, Button, HStack, Box, useConst } from '@chakra-ui/react'
import { yupResolver } from '@hookform/resolvers/yup'
import * as yup from 'yup'
import { skipToken } from '@reduxjs/toolkit/dist/query'

/**
 * The internal imports
 */
import {
  useGetUserQuery,
  useCreateUserMutation,
  useUpdateUserMutation,
} from '@/lib/services/modules'
import { useToast } from '@/lib/hooks'
import { ModalContext } from '@/lib/contexts'
import {
  FormProvider,
  Input,
  Select,
  ErrorMessage,
  AddProjectsToUser,
} from '@/components'
import { Role } from '@/lib/config/constants'
import type { UserInputs, UserProject, CustomPartial } from '@/types'

/**
 * Type definitions
 */
type UserFormProps = {
  id?: number
}

const UserForm: FC<UserFormProps> = ({ id = null }) => {
  const { t } = useTranslation('users')
  const { newToast } = useToast()
  const { closeModal } = useContext(ModalContext)
  const methods = useForm<UserInputs>({
    resolver: yupResolver(
      yup.object({
        firstName: yup.string().label(t('firstName')).required(),
        lastName: yup.string().label(t('lastName')).required(),
        email: yup.string().label(t('email')).required().email(),
        role: yup.string().label(t('role')).required(),
      })
    ),
    reValidateMode: 'onSubmit',
    defaultValues: {
      firstName: '',
      lastName: '',
      email: '',
      role: undefined,
    },
  })

  const [userProjects, setUserProjects] = useState<
    CustomPartial<UserProject, 'projectId'>[]
  >([])

  const {
    data: user,
    isSuccess: isGetUserSuccess,
    isError: isGetUserError,
    error: getUserError,
  } = useGetUserQuery(id ?? skipToken)

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
    { label: t('roles.admin'), value: Role.admin },
    { label: t('roles.clinician'), value: Role.clinician },
    {
      label: t('roles.deploymentManager'),
      value: Role.deploymentManager,
    },
  ])

  /**
   * Reset the form with the existing user data
   */
  useEffect(() => {
    if (isGetUserSuccess) {
      const role = roleOptions.find(option => option.value === user.role)

      if (role) {
        methods.reset({
          firstName: user.firstName,
          lastName: user.lastName,
          email: user.email,
          role: role.value,
        })

        setUserProjects(
          user.userProjects.map(userProject => ({
            id: userProject.id,
            isAdmin: userProject.isAdmin,
            projectId: userProject.projectId,
          }))
        )
      }
    }
  }, [isGetUserSuccess])

  /**
   * Calls the create user mutation with the form data
   * @param {*} data { firstName, lastName, email }
   */
  const onSubmit = (data: UserInputs) => {
    if (id && user) {
      const cleanedUserProjects: Partial<UserProject>[] = user.userProjects.map(
        previousUserProject => {
          const foundUserProject = userProjects.find(
            userProject => userProject.id === previousUserProject.id
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
        }
      )

      userProjects.forEach(userProject => {
        const foundUserProject = cleanedUserProjects.find(
          cleanedUserProject => cleanedUserProject.id === userProject.id
        )
        if (!foundUserProject) {
          cleanedUserProjects.push({
            projectId: userProject.projectId,
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
      createUser({
        ...data,
        userProjectsAttributes: userProjects,
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
    <FormProvider<UserInputs>
      methods={methods}
      isError={isCreateUserError || isUpdateUserError}
      error={{ ...createUserError, ...updateUserError }}
    >
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
          <AddProjectsToUser
            userProjects={userProjects}
            setUserProjects={setUserProjects}
          />
          {isCreateUserError && (
            <Box w='full'>
              <ErrorMessage error={createUserError} />
            </Box>
          )}
          {isUpdateUserError && (
            <Box w='full'>
              <ErrorMessage error={updateUserError} />
            </Box>
          )}
          {isGetUserError && (
            <Box w='full'>
              <ErrorMessage error={getUserError} />
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
