/**
 * The external imports
 */
import { useEffect, useContext, useState, FC } from 'react'
import { FormProvider, useForm } from 'react-hook-form'
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
} from '@/lib/services/modules/user'
import { useToast } from '@/lib/hooks'
import { ModalContext } from '@/lib/contexts'
import { Input, Select, FormError, AddProjectsToUser } from '@/components'
import type { UserInputs } from '@/types/user'
import type { UserProject } from '@/types/userProject'
import { CustomPartial } from '@/types/common'

/**
 * Type definitions
 */
type UserFormProps = {
  id?: string
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
        role: yup.number().label(t('role')).required(),
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
    { key: 'admin', label: t('roles.admin'), value: 0 },
    { key: 'clinician', label: t('roles.clinician'), value: 1 },
    {
      key: 'deployment_manager',
      label: t('roles.deploymentManager'),
      value: 2,
    },
  ])

  /**
   * Reset the form with the existing user data
   */
  useEffect(() => {
    if (isGetUserSuccess) {
      methods.reset({
        firstName: user.firstName,
        lastName: user.lastName,
        email: user.email,
        role: roleOptions.find(option => option.key === user.role)?.key,
      })

      setUserProjects(
        user.userProjects.map(userProject => ({
          id: userProject.id,
          isAdmin: userProject.isAdmin,
          projectId: userProject.projectId,
        }))
      )
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
          <AddProjectsToUser
            userProjects={userProjects}
            setUserProjects={setUserProjects}
          />
          {isCreateUserError && (
            <Box w='full'>
              <FormError error={createUserError} />
            </Box>
          )}
          {isUpdateUserError && (
            <Box w='full'>
              <FormError error={updateUserError} />
            </Box>
          )}
          {isGetUserError && (
            <Box w='full'>
              <FormError error={getUserError} />
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
