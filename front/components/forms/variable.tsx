/**
 * The external imports
 */
import { useTranslation } from 'next-i18next'

import { VStack, Spinner, Heading } from '@chakra-ui/react'
import { useGetProjectQuery } from '@/lib/api/modules'
import { FC, Dispatch, SetStateAction, useMemo, useEffect } from 'react'

/**
 * The internal imports
 */
import {
  Select,
  Input,
  Textarea,
  Checkbox,
  Number,
  Autocomplete,
} from '@/components'
import {
  CATEGORIES_DISPLAYING_ESTIMABLE_OPTION,
  CATEGORIES_DISPLAYING_PREFILL,
  CATEGORIES_DISPLAYING_SYSTEM,
  CATEGORIES_DISPLAYING_UNAVAILABLE_OPTION,
  CATEGORIES_UNAVAILABLE_NOT_FEASIBLE,
  CATEGORIES_UNAVAILABLE_UNKNOWN,
  CATEGORIES_WITHOUT_COMPLAINT_CATEGORIES_OPTION,
} from '@/lib/config/constants'
import { useFormContext } from 'react-hook-form'
import { VariableService } from '@/lib/services'

const VariableForm: FC<{
  id?: number
  projectId: number
  nextStep?: () => void
  setVariableId?: Dispatch<SetStateAction<number | undefined>>
}> = ({ id = null, projectId }) => {
  const { t, i18n } = useTranslation('variables')

  const { watch } = useFormContext()
  const watchCategory = watch('type')

  const { data: project, isSuccess: isGetProjectSuccess } =
    useGetProjectQuery(projectId)

  // TODO NEED ENUM FROM BACK
  const categories = VariableService.categories.map(category => ({
    id: category,
    label: category,
  }))

  const canDisplayUnavailableOption = useMemo(
    () => CATEGORIES_DISPLAYING_UNAVAILABLE_OPTION.includes(watchCategory),
    [watchCategory]
  )

  const unavailableLabel = useMemo(() => {
    if (canDisplayUnavailableOption) {
      if (CATEGORIES_UNAVAILABLE_UNKNOWN.includes(watchCategory)) {
        return t('unavailable.unknown')
      }

      if (CATEGORIES_UNAVAILABLE_NOT_FEASIBLE.includes(watchCategory)) {
        return t('unavailable.unfeasible')
      }
    }
    return t('unavailable.unavailable')
  }, [canDisplayUnavailableOption, watchCategory, i18n.language])

  if (isGetProjectSuccess) {
    return (
      <VStack alignItems='flex-start' spacing={8}>
        {/* Available at any time */}
        <Heading variant='h2'>Général</Heading>
        <Input
          name='label'
          label={t('label')}
          helperText={t('helperText', {
            language: t(`languages.${project.language.code}`, {
              ns: 'common',
              defaultValue: '',
            }),
            ns: 'common',
          })}
          isRequired
        />
        <Select label={t('type')} options={categories} name='type' isRequired />
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
          options={categories}
          name='emergencyStatus'
        />
        <Checkbox label={t('isMandatory')} name='isMandatory' />
        <Checkbox label={t('isNeonat')} name='isNeonat' />
        <Checkbox label={t('isIdentifiable')} name='isIdentifiable' />

        {/* Is disabled based on categoriesDisablingAnswerType*/}
        <Select
          label={t('answerType')}
          options={categories}
          name='answerType'
          isRequired
        />

        {/* TODO: ADD MEDIA */}

        <Heading variant='h2'>Conditional</Heading>

        {/* CONDITIONAL DISPLAY */}

        {CATEGORIES_DISPLAYING_SYSTEM.includes(watchCategory) && (
          <Select
            label={t('system')}
            options={categories}
            name='system'
            isRequired
          />
        )}

        {canDisplayUnavailableOption && (
          <Checkbox label={unavailableLabel} name='unavailable' />
        )}

        {CATEGORIES_DISPLAYING_PREFILL.includes(watchCategory) && (
          <Checkbox label={t('isPrefill')} name='isPrefill' />
        )}

        {CATEGORIES_DISPLAYING_ESTIMABLE_OPTION.includes(watchCategory) && (
          <Checkbox label={t('estimable')} name='estimable' />
        )}

        {/* Hide if category is "Complaint Category" */}
        {CATEGORIES_WITHOUT_COMPLAINT_CATEGORIES_OPTION.includes(
          watchCategory
        ) && (
          <Autocomplete
            name='Complaint categories'
            label={t('categories.complaintCategory')}
            options={[
              {
                label: 'I am red',
                value: 'i-am-red',
              },
              {
                label: 'I am blue',
                value: 'i-am-blue',
              },
              {
                label: 'I am yellow',
                value: 'i-am-yellow',
              },
              {
                label: 'I am orange',
                value: 'i-am-orange',
              },
              {
                label: 'I am green',
                value: 'i-am-green',
              },
            ]}
          />
        )}

        {/* If answer type is formula */}
        <Input name='formula' label='Formula' />

        {/* If answer type is decimal */}
        <Select label='Value rounded to' options={categories} name='round' />

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
    )
  }

  return <Spinner size='xl' />
}

export default VariableForm
