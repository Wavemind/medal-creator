/**
 * The external imports
 */
import React, { useEffect, useMemo } from 'react'
import { useTranslation } from 'next-i18next'
import { useFormContext } from 'react-hook-form'
import { VStack, Spinner, useConst, Divider } from '@chakra-ui/react'

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
  FormulaInformation,
} from '@/components'
import {
  CATEGORIES_DISABLING_ANSWER_TYPE,
  CATEGORIES_DISPLAYING_ESTIMABLE_OPTION,
  CATEGORIES_DISPLAYING_PREFILL,
  CATEGORIES_DISPLAYING_SYSTEM,
  CATEGORIES_DISPLAYING_UNAVAILABLE_OPTION,
  CATEGORIES_UNAVAILABLE_NOT_FEASIBLE,
  CATEGORIES_UNAVAILABLE_UNKNOWN,
  CATEGORIES_WITHOUT_COMPLAINT_CATEGORIES_OPTION,
  CATEGORIES_WITHOUT_STAGE,
  DISPLAY_FORMULA_ANSWER_TYPE,
  DISPLAY_ROUND_ANSWER_TYPE,
  INPUT_ANSWER_TYPES,
  NUMERIC_ANSWER_TYPES,
  CATEGORY_TO_STAGE_MAP,
  CATEGORY_TO_SYSTEM_MAP,
  VariableTypesEnum,
  AnswerTypesEnum,
} from '@/lib/config/constants'
import {
  useGetComplaintCategoriesQuery,
  useGetProjectQuery,
} from '@/lib/api/modules'
import { VariableService } from '@/lib/services'
import { camelize } from '@/lib/utils'
import { usePrevious } from '@/lib/hooks'
import type { VariableFormComponent } from '@/types'

const VariableForm: VariableFormComponent = ({ answerTypes, projectId }) => {
  const { t, i18n } = useTranslation('variables')
  const { watch, setValue } = useFormContext()

  const watchCategory: VariableTypesEnum = watch('type')
  const watchAnswerType: number = parseInt(watch('answerType'))
  const watchMinValueWarning: string = watch('minValueWarning')
  const watchMaxValueWarning: string = watch('maxValueWarning')
  const watchMinValueError: string = watch('minValueError')
  const watchMaxValueError: string = watch('maxValueError')

  useEffect(() => {
    if (watchMinValueWarning === '') {
      setValue('minMessageWarning', undefined)
    }
  }, [watchMinValueWarning])

  useEffect(() => {
    if (watchMaxValueWarning === '') {
      setValue('maxMessageWarning', undefined)
    }
  }, [watchMaxValueWarning])

  useEffect(() => {
    if (watchMinValueError === '') {
      setValue('minMessageError', undefined)
    }
  }, [watchMinValueError])

  useEffect(() => {
    if (watchMaxValueError === '') {
      setValue('maxMessageError', undefined)
    }
  }, [watchMaxValueError])

  const { data: project, isSuccess: isGetProjectSuccess } =
    useGetProjectQuery(projectId)
  const { data: complaintCategories, isSuccess: isGetCCSuccess } =
    useGetComplaintCategoriesQuery({ projectId })

  const categories = useConst(() =>
    VariableService.categories.map(category => ({
      value: category,
      label: t(
        `categories.${VariableService.extractCategoryKey(category)}.label`,
        { defaultValue: '' }
      ),
    }))
  )

  const complaintCategoriesOptions = useMemo(() => {
    if (complaintCategories && project) {
      return complaintCategories.edges.map(edge => ({
        value: edge.node.id,
        label: edge.node.labelTranslations[project.language.code],
      }))
    }
    return []
  }, [complaintCategories, project])

  const stages = useConst(() =>
    VariableService.stages.map(stage => ({
      value: stage,
      label: t(`stages.${camelize(stage)}`, {
        defaultValue: '',
      }),
    }))
  )

  const emergencyStatuses = useConst(() =>
    VariableService.emergencyStatuses.map(status => ({
      value: status,
      label: t(`emergencyStatuses.${status}`, { defaultValue: '' }),
    }))
  )

  const rounds = useConst(() =>
    VariableService.rounds.map(round => ({
      value: round,
      label: t(`rounds.${round}`, { defaultValue: '' }),
    }))
  )

  const answerTypeOptions = useConst(() =>
    answerTypes.map(answerType => ({
      value: answerType.id,
      label: t(`answerTypes.${answerType.labelKey}`, {
        defaultValue: '',
      }),
    }))
  )

  /**
   * Test if unavailable input should be displayed
   */
  const canDisplayUnavailableOption = useMemo(
    () => CATEGORIES_DISPLAYING_UNAVAILABLE_OPTION.includes(watchCategory),
    [watchCategory]
  )

  /**
   * Define label to display for unavailable options
   */
  const unavailableLabel = useMemo(() => {
    if (canDisplayUnavailableOption) {
      if (CATEGORIES_UNAVAILABLE_UNKNOWN.includes(watchCategory)) {
        return t('isUnavailable.unknown')
      }

      if (CATEGORIES_UNAVAILABLE_NOT_FEASIBLE.includes(watchCategory)) {
        return t('isUnavailable.unfeasible')
      }
    }
    setValue('isUnavailable', false)
    return t('isUnavailable.unavailable')
  }, [canDisplayUnavailableOption, watchCategory, i18n.language])

  /**
   * Set value of stage and answerType
   */
  useEffect(() => {
    if (watchCategory !== VariableTypesEnum.BackgroundCalculation) {
      setValue('stage', CATEGORY_TO_STAGE_MAP[watchCategory])
    } else {
      setValue('stage', undefined)
    }

    if (
      [VariableTypesEnum.ComplaintCategory, VariableTypesEnum.Vaccine].includes(
        watchCategory
      )
    ) {
      setValue('answerType', AnswerTypesEnum.RadioBoolean)
    } else if (
      [
        VariableTypesEnum.BasicMeasurement,
        VariableTypesEnum.VitalSignAnthropometric,
      ].includes(watchCategory)
    ) {
      setValue('answerType', AnswerTypesEnum.InputFloat)
    } else if (watchCategory === VariableTypesEnum.BackgroundCalculation) {
      setValue('answerType', AnswerTypesEnum.FormulaFloat)
    } else {
      setValue('answerType', watchAnswerType)
    }
  }, [watchCategory])

  /**
   * Change system options based on category selected
   */
  const systems = useMemo(() => {
    if (Object.keys(CATEGORY_TO_SYSTEM_MAP).includes(watchCategory)) {
      return CATEGORY_TO_SYSTEM_MAP[
        watchCategory as keyof typeof CATEGORY_TO_SYSTEM_MAP
      ].map(system => ({
        value: system,
        label: t(`systems.${system}`, { defaultValue: system }),
      }))
    }

    return []
  }, [watchCategory])

  const previousSystem = usePrevious(systems)

  /**
   * Clear system value if systems list changed
   */
  useEffect(() => {
    if (previousSystem && previousSystem.length !== systems.length) {
      setValue('system', undefined)
    }
  }, [systems.length])

  if (isGetProjectSuccess && isGetCCSuccess) {
    return (
      <VStack alignItems='flex-start' spacing={8}>
        <Select label={t('type')} options={categories} name='type' isRequired />

        <Select
          label={t('answerType')}
          options={answerTypeOptions}
          name='answerType'
          isDisabled={CATEGORIES_DISABLING_ANSWER_TYPE.includes(watchCategory)}
          isRequired
        />

        {!CATEGORIES_WITHOUT_STAGE.includes(watchCategory) && (
          <Select
            label={t('stage')}
            options={stages}
            name='stage'
            isRequired
            isDisabled={true}
          />
        )}

        {CATEGORIES_DISPLAYING_SYSTEM.includes(watchCategory) && (
          <Select
            label={t('system')}
            options={systems}
            name='system'
            isRequired
          />
        )}

        <Select
          label={t('emergencyStatus')}
          options={emergencyStatuses}
          name='emergencyStatus'
        />

        <Checkbox label={t('isMandatory')} name='isMandatory' />
        <Checkbox label={t('isNeonat')} name='isNeonat' />

        {canDisplayUnavailableOption && (
          <Checkbox label={unavailableLabel} name='isUnavailable' />
        )}

        {CATEGORIES_DISPLAYING_PREFILL.includes(watchCategory) && (
          <Checkbox label={t('isPreFill')} name='isPreFill' />
        )}

        <Checkbox label={t('isIdentifiable')} name='isIdentifiable' />

        {CATEGORIES_DISPLAYING_ESTIMABLE_OPTION.includes(watchCategory) && (
          <Checkbox label={t('isEstimable')} name='isEstimable' />
        )}

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

        {!CATEGORIES_WITHOUT_COMPLAINT_CATEGORIES_OPTION.includes(
          watchCategory
        ) && (
          <Autocomplete
            isMulti={true}
            name='complaintCategoryOptions'
            label={t('categories.complaintCategory.label')}
            placeholder={t('select', { ns: 'common' })}
            options={complaintCategoriesOptions}
          />
        )}

        {DISPLAY_FORMULA_ANSWER_TYPE.includes(watchAnswerType) && (
          <Input
            label={t('formula')}
            name='formula'
            isRequired
            hasDrawer
            drawerContent={<FormulaInformation />}
            drawerTitle={t('formulaInformation.formulaTooltipTitle')}
          />
        )}

        {DISPLAY_ROUND_ANSWER_TYPE.includes(watchAnswerType) && (
          <Select label={t('round')} options={rounds} name='round' />
        )}

        {INPUT_ANSWER_TYPES.includes(watchAnswerType) && (
          <Input
            label={t('placeholder')}
            name='placeholder'
            helperText={t('helperText', {
              language: t(`languages.${project.language.code}`, {
                ns: 'common',
                defaultValue: '',
              }),
              ns: 'common',
            })}
          />
        )}

        {NUMERIC_ANSWER_TYPES.includes(watchAnswerType) && (
          <React.Fragment>
            <Number name='minValueWarning' label={t('minValueWarning')} />
            {watchMinValueWarning && (
              <React.Fragment>
                <Textarea
                  name='minMessageWarning'
                  label={t('minMessageWarning')}
                  isRequired
                  helperText={t('helperText', {
                    language: t(`languages.${project.language.code}`, {
                      ns: 'common',
                      defaultValue: '',
                    }),
                    ns: 'common',
                  })}
                />
                <Divider />
              </React.Fragment>
            )}

            <Number name='maxValueWarning' label={t('maxValueWarning')} />
            {watchMaxValueWarning && (
              <React.Fragment>
                <Textarea
                  name='maxMessageWarning'
                  label={t('maxMessageWarning')}
                  isRequired
                  helperText={t('helperText', {
                    language: t(`languages.${project.language.code}`, {
                      ns: 'common',
                      defaultValue: '',
                    }),
                    ns: 'common',
                  })}
                />
                <Divider />
              </React.Fragment>
            )}

            <Number name='minValueError' label={t('minValueError')} />
            {watchMinValueError && (
              <React.Fragment>
                <Textarea
                  name='minMessageError'
                  label={t('minMessageError')}
                  isRequired
                  helperText={t('helperText', {
                    language: t(`languages.${project.language.code}`, {
                      ns: 'common',
                      defaultValue: '',
                    }),
                    ns: 'common',
                  })}
                />
                <Divider />
              </React.Fragment>
            )}

            <Number name='maxValueError' label={t('maxValueError')} />
            {watchMaxValueError && (
              <Textarea
                name='maxMessageError'
                label={t('maxMessageError')}
                isRequired
                helperText={t('helperText', {
                  language: t(`languages.${project.language.code}`, {
                    ns: 'common',
                    defaultValue: '',
                  }),
                  ns: 'common',
                })}
              />
            )}
          </React.Fragment>
        )}

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
      </VStack>
    )
  }

  return <Spinner size='xl' />
}

export default VariableForm
