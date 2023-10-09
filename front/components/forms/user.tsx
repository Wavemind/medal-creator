/**
 * The external imports
 */
import { useEffect, useState } from 'react'
import { useForm } from 'react-hook-form'
import { useTranslation } from 'next-i18next'
import { VStack, Button, HStack, useConst } from '@chakra-ui/react'
import { yupResolver } from '@hookform/resolvers/yup'
import * as yup from 'yup'
import { skipToken } from '@reduxjs/toolkit/dist/query'
import { useSession } from 'next-auth/react'

/**
 * The internal imports
 */
import {
  useGetUserQuery,
  useCreateUserMutation,
  useUpdateUserMutation,
} from '@/lib/api/modules/enhanced/user.enhanced'
import { useModal } from '@/lib/hooks'
import FormProvider from '@/components/formProvider'
import Input from '@/components/inputs/input'
import Select from '@/components/inputs/select'
import AddProjectsToUser from '@/components/inputs/addProjectsToUser'
import {
  UserProject,
  CustomPartial,
  UserFormComponent,
  RoleEnum,
} from '@/types'
import type { CreateUserMutationVariables } from '@/lib/api/modules/generated/user.generated'

const UserForm: UserFormComponent = ({ id = null }) => {
  const { t } = useTranslation('users')
  const { close } = useModal()

  const { data: session, update } = useSession()

  const handleSuccess = () => {
    if (id === session?.user.id && updatedUser) {
      update({ user: updatedUser.user })
    }
    close()
  }

  const methods = useForm<CreateUserMutationVariables>({
    resolver: yupResolver(
      yup.object({
        firstName: yup.string().label(t('firstName')).required(),
        lastName: yup.string().label(t('lastName')).required(),
        email: yup.string().label(t('email')).required().email(),
        role: yup
          .mixed()
          .oneOf(Object.values(RoleEnum))
          .label(t('role'))
          .required(),
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
  } = useGetUserQuery(id ? { id } : skipToken)

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
      data: updatedUser,
      isSuccess: isUpdateUserSuccess,
      isError: isUpdateUserError,
      error: updateUserError,
    },
  ] = useUpdateUserMutation()

  const roleOptions = useConst(() => [
    { label: t('roles.admin'), value: RoleEnum.Admin },
    { label: t('roles.clinician'), value: RoleEnum.Clinician },
    {
      label: t('roles.deploymentManager'),
      value: RoleEnum.DeploymentManager,
    },
    {
      label: t('roles.viewer'),
      value: RoleEnum.Viewer,
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
  }, [isGetUserSuccess, user])

  /**
   * Calls the create user mutation with the form data
   * @param {*} data { firstName, lastName, email }
   */
  const onSubmit = (data: CreateUserMutationVariables) => {
    if (id && user) {
      const cleanedUserProjects: Array<Partial<UserProject>> =
        user.userProjects.map(previousUserProject => {
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
        })

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

  return (
    <FormProvider<CreateUserMutationVariables>
      methods={methods}
      isError={isCreateUserError || isUpdateUserError || isGetUserError}
      error={{ ...createUserError, ...updateUserError, ...getUserError }}
      isSuccess={isUpdateUserSuccess || isCreateUserSuccess}
      callbackAfterSuccess={handleSuccess}
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
          <HStack justifyContent='flex-end'>
            <Button
              type='submit'
              data-testid='submit'
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
