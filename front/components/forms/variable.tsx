/**
 * The external imports
 */
import { useTranslation } from 'next-i18next'
import { yupResolver } from '@hookform/resolvers/yup'
import * as yup from 'yup'
import { useForm } from 'react-hook-form'
import { VStack, Spinner, Heading } from '@chakra-ui/react'
import { useGetProjectQuery } from '@/lib/api/modules'
import type { FC } from 'react'

/**
 * The internal imports
 */
import {
  FormProvider,
  Select,
  Input,
  Textarea,
  Checkbox,
  Number,
} from '@/components'

const VariableForm: FC<{
  id?: number
  projectId: number
  nextStep?: () => void
  setVariableId?: React.Dispatch<React.SetStateAction<number | undefined>>
}> = ({ id = null, projectId }) => {
  const { t } = useTranslation('variables')

  const { data: project, isSuccess: isGetProjectSuccess } =
    useGetProjectQuery(projectId)

  const methods = useForm<UserInputs>({
    resolver: yupResolver(
      yup.object({
        label: yup.string().label(t('label')).required(),
        mandatory: yup.string().label(t('mandatory')).required(),
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
      isMandatory: false,
      system: undefined,
      stage: undefined,
      type: undefined,
      description: '',
      answerType: undefined,
      unavailable: false,
      formulare: undefined,
      snomedId: undefined,
      snomedLabel: undefined,
      isTriage: false,
      isIdentifiable: false,
      isPrefill: false,
      minValueWarning: undefined,
      maxValueWarning: undefined,
      minValueError: undefined,
      maxValueError: undefined,
      minMessageWarning: undefined,
      maxMessageWarning: undefined,
      minMessageError: undefined,
      maxMessageError: undefined,
      round: undefined,
      estimable: false,
      emergencyStatus: undefined,
      isNeonat: false,
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
          <VStack alignItems='flex-start' spacing={8}>
            {/* Available at any time */}
            <Heading variant='h2'>Général</Heading>
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
            <Select
              label={t('emergencyStatus')}
              options={category}
              name='emergencyStatus'
              isRequired
            />
            <Checkbox label='Is mandatory ?' name='isMandatory' />
            <Checkbox label='Is young infant ?' name='isNeonat' />
            <Checkbox
              label='This question can identify a patient'
              name='isIdentifiable'
            />
            <Input name='snomed' label='snomed' />

            {/* Is disabled based on categoriesDisablingAnswerType*/}
            <Select
              label='Answer type'
              options={category}
              name='answerType'
              isRequired
            />

            {/* TODO: ADD MEDIA */}

            <Heading variant='h2'>Conditional</Heading>

            {/* CONDITIONAL DISPLAY */}

            {/* Is hide show/hide on categoriesDisplayingSystem*/}
            <Select
              label='System'
              options={category}
              name='system'
              isRequired
            />

            {/* Is hide show/hide on categoriesWithoutStage*/}
            <Select label='Stage' options={category} name='stage' isRequired />

            {/* Is hide show/hide on categoriesDisplayingUnavailableOption*/}
            <Checkbox label='Variable can be unavailable' name='unavailable' />

            {/* Is hide show/hide on categoriesDisplayingPreFill*/}
            <Checkbox
              label='Value should be reused for a new case'
              name='unavailable'
            />
            {/* Is hide show/hide on categoriesDisplayingEstimableOption*/}
            <Checkbox label='Value can be estimated' name='estimable' />

            {/* Hide if category is "Complaint Category" */}
            <Input name='Complaint categories' label='Complaint Categories' />

            {/* If answer type is formula */}
            <Input name='formula' label='Formula' />

            {/* If answer type is decimal */}
            <Select
              label='Value rounded to'
              options={category}
              name='round'
              isRequired
            />

            {/* Is displayed if answer_type is INPUT_ANSWER_TYPE */}
            <Input name='placerholder' label='Placeholder' />

            {/* Is displayed if answer_type is NUMERIC_ANSWER_TYPES */}
            <Number name='minValueWarning' label='Lower limit before warning' />
            <Input name='maxValueWarning' label='Higher limit before warning' />
            <Input name='min_value_error' label='Lower limit before error' />
            <Input name='max_value_error' label='Higher limit before error' />
            <Textarea
              name='min_message_warning_[en/fr]'
              label='Warning message if below range'
              helperText={t('helperText', {
                language: t(`languages.${project.language.code}`, {
                  ns: 'common',
                  defaultValue: '',
                }),
                ns: 'common',
              })}
            />
            <Textarea
              name='max_message_warning_[en/fr]'
              label='Warning message if above range'
              helperText={t('helperText', {
                language: t(`languages.${project.language.code}`, {
                  ns: 'common',
                  defaultValue: '',
                }),
                ns: 'common',
              })}
            />
            <Textarea
              name='min_message_error_[en/fr]'
              label='Error message if below range'
              helperText={t('helperText', {
                language: t(`languages.${project.language.code}`, {
                  ns: 'common',
                  defaultValue: '',
                }),
                ns: 'common',
              })}
            />
            <Textarea
              name='max_message_error_[en/fr]'
              label='Error message if above range'
              helperText={t('helperText', {
                language: t(`languages.${project.language.code}`, {
                  ns: 'common',
                  defaultValue: '',
                }),
                ns: 'common',
              })}
            />
          </VStack>
        </form>
      </FormProvider>
    )
  }

  return <Spinner />
}

export default VariableForm
