/**
 * The external imports
 */
import { useTranslation } from 'next-i18next'
import { yupResolver } from '@hookform/resolvers/yup'
import * as yup from 'yup'
import { useForm } from 'react-hook-form'
import { VStack, Spinner } from '@chakra-ui/react'
import { useGetProjectQuery } from '@/lib/api/modules'
import type { FC } from 'react'

/**
 * The internal imports
 */
import { FormProvider, Select, Input, Textarea } from '@/components'

const VariableForm: FC<{ id?: number; projectId: number }> = ({
  id = null,
  projectId,
}) => {
  const { t } = useTranslation('variables')

  const { data: project, isSuccess: isGetProjectSuccess } =
    useGetProjectQuery(projectId)

  const methods = useForm<UserInputs>({
    resolver: yupResolver(
      yup.object({
        label: yup.string().label(t('label')).required(),
        description: yup.string().label(t('description')).required(),
        category: yup.string().label(t('firstName')).required(),
        answerType: yup.string().label(t('lastName')).required(),
        stage: yup.string().label(t('email')).required().email(),
        emergencyStatus: yup.string().label(t('role')).required(),
      })
    ),
    reValidateMode: 'onSubmit',
    defaultValues: {
      label: '',
      description: '',
      category: undefined,
      answerType: undefined,
      stage: undefined,
      emergencyStatus: undefined,
    },
  })

  const category = [{ id: 1, label: 'Coucou' }]

  const onSubmit = (data: UserInputs) => {
    console.log('coucou')
  }

  if (isGetProjectSuccess) {
    return (
      <FormProvider methods={methods} isError={false} error={{}}>
        <form onSubmit={methods.handleSubmit(onSubmit)}>
          <VStack alignItems='flex-end' spacing={8}>
            {/* Available at any time */}
            <Input
              name='label'
              label={t('label')}
              isRequired
              helperText={t('helperText', {
                language: t(`languages.${project.language.code}`, {
                  ns: 'common',
                  defaultValue: '',
                }),
                ns: 'common',
              })}
            />
            <Select
              label={t('category')}
              options={category}
              name='category'
              isRequired
            />
            <Textarea
              name='description'
              label={t('description')}
              helperText={t('helperText', {
                language: t(`languages.${project.language.code}`, {
                  ns: 'common',
                  defaultValue: '',
                }),
                ns: 'common',
              })}
            />
            {/* Is conditional */}
            <Select
              label={t('answerType')}
              options={category}
              name='answerType'
              isRequired
            />
            <Select
              label={t('stage')}
              options={category}
              name='stage'
              isRequired
            />
            <Select
              label={t('emergencyStatus')}
              options={category}
              name='emergencyStatus'
              isRequired
            />
          </VStack>
        </form>
      </FormProvider>
    )
  }

  return <Spinner />
}

export default VariableForm
