/**
 * The external imports
 */
import { useEffect, useState } from 'react'
import { SubmitHandler, useForm } from 'react-hook-form'
import { useTranslation } from 'next-i18next'
import { VStack, Button, HStack, useConst } from '@chakra-ui/react'
import { yupResolver } from '@hookform/resolvers/yup'
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
import { useModal } from '@/lib/hooks/useModal'
import UserService from '@/lib/services/user.service'
import FormProvider from '@/components/formProvider'
import Input from '@/components/inputs/input'
import Select from '@/components/inputs/select'
import AddProjectsToUser from '@/components/inputs/addProjectsToUser'
import {
  UserProject,
  CustomPartial,
  RoleEnum,
  UserFormComponent,
} from '@/types'
import { CreateUserMutationVariables } from '@/lib/api/modules/generated/user.generated'

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
    resolver: yupResolver(UserService.getValidationSchema(t)),
    reValidateMode: 'onSubmit',
    defaultValues: {
      firstName: '',
      lastName: '',
      email: '',
      role: undefined,
    },
  })

  const [userProjects, setUserProjects] = useState<
    Array<CustomPartial<UserProject, 'projectId'>>
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
        methods.reset(UserService.buildFormData(user, role.value))

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
  const onSubmit: SubmitHandler<CreateUserMutationVariables> = data => {
    if (id && user) {
      const cleanedUserProjects = UserService.cleanUserProjects(
        user,
        userProjects
      )

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
