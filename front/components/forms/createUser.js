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
import { useCreateUserMutation } from '/lib/services/modules/user'
import { useToast } from '/lib/hooks'
import { ModalContext } from '/lib/contexts'
import { Input, Select, MultiSelectWithAdmin } from '/components'
import { useGetProjectsQuery } from '/lib/services/modules/project'

const CreateUserForm = () => {
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

  const [createUser, { isSuccess, isError, error }] = useCreateUserMutation()
  const { data: projects } = useGetProjectsQuery()

  const roleOptions = useConst(() => [
    { label: t('roles.admin'), value: 0 },
    { label: t('roles.clinician'), value: 1 },
    { label: t('roles.deploymentManager'), value: 2 },
  ])

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
    createUser({
      ...data,
      userProjectsAttributes: cleanedUserProjects,
    })
  }

  /**
   * If successful, queue the toast and close the modal
   */
  useEffect(() => {
    if (isSuccess) {
      newToast({
        message: t('notifications.createSuccess', { ns: 'common' }),
        status: 'success',
      })
      closeModal()
    }
  }, [isSuccess])

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
          />
          {isError && (
            <Box w='full'>
              <Text fontSize='m' color='red' data-cy='server_message'>
                {typeof error.message === 'string'
                  ? error.message.split(':')[0]
                  : error.data.errors.join()}
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

export default CreateUserForm
