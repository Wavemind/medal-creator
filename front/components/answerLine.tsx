/**
 * The external imports
 */
import React, { useEffect, useMemo } from 'react'
import { HStack, IconButton } from '@chakra-ui/react'
import { useTranslation } from 'next-i18next'
import { useFieldArray, useFormContext } from 'react-hook-form'

/**
 * The internal imports
 */
import { DeleteIcon } from '@/assets/icons'
import { Input, Number, Select } from '@/components'
import { useGetProjectQuery } from '@/lib/api/modules'
import { VariableService } from '@/lib/services'
import {
  CATEGORIES_WITHOUT_OPERATOR,
  ANSWER_TYPE_WITHOUT_OPERATOR_AND_ANSWER,
  VariableTypesEnum,
  AnswerTypesEnum,
  OperatorsEnum,
} from '@/lib/config/constants'
import type { AnswerInputs, AnswerLineComponent } from '@/types'

const AnswerLine: AnswerLineComponent = ({ field, index, projectId }) => {
  const { t } = useTranslation('variables')

  const { control, watch, getValues, unregister } = useFormContext()

  const { remove } = useFieldArray({
    control,
    name: 'answersAttributes',
  })

  const watchAnswerType: number = parseInt(watch('answerType'))
  const watchCategory: VariableTypesEnum = watch('type')
  const watchFieldArray: Array<AnswerInputs> = watch('answersAttributes')
  const watchOperator: OperatorsEnum = watch(
    `answersAttributes[${index}].operator`
  )

  const { data: project, isSuccess: isGetProjectSuccess } =
    useGetProjectQuery(projectId)

  const operators = useMemo(() => {
    let availableOperators = VariableService.operators

    if (
      watchFieldArray.some(
        (field, i) => field.operator === OperatorsEnum.Less && i !== index
      )
    ) {
      availableOperators = availableOperators.filter(
        operator => operator !== OperatorsEnum.Less
      )
    }

    if (
      watchFieldArray.some(
        (field, i) =>
          field.operator === OperatorsEnum.MoreOrEqual && i !== index
      )
    ) {
      availableOperators = availableOperators.filter(
        operator => operator !== OperatorsEnum.MoreOrEqual
      )
    }

    return availableOperators.map(operator => ({
      value: operator,
      label: t(`answer.operators.${operator}`, { defaultValue: '' }),
    }))
  }, [watchFieldArray])

  useEffect(() => {
    const fieldValues = getValues(`answersAttributes[${index}]`)
    if (fieldValues.operator === OperatorsEnum.Between) {
      unregister(`answersAttributes[${index}].value`)
    } else {
      unregister([
        `answersAttributes[${index}].startValue`,
        `answersAttributes[${index}].endValue`,
      ])
    }
  }, [watchOperator])

  if (isGetProjectSuccess) {
    return (
      <HStack key={field.id} alignItems='flex-end'>
        <Input
          name={`answersAttributes[${index}].label`}
          label={t('answer.label')}
          helperText={t('helperText', {
            language: t(`languages.${project.language.code}`, {
              ns: 'common',
              defaultValue: '',
            }),
            ns: 'common',
          })}
          isRequired
        />
        {!ANSWER_TYPE_WITHOUT_OPERATOR_AND_ANSWER.includes(watchAnswerType) && (
          <React.Fragment>
            {!CATEGORIES_WITHOUT_OPERATOR.includes(watchCategory) ? (
              <React.Fragment>
                <Select
                  label={t('answer.operator')}
                  options={operators}
                  name={`answersAttributes[${index}].operator`}
                  isRequired
                />
                {watchFieldArray[index]?.operator === OperatorsEnum.Between ? (
                  <React.Fragment>
                    <Number
                      name={`answersAttributes[${index}].startValue`}
                      label={t('answer.startValue')}
                      isRequired
                      max={100}
                      precision={
                        watchAnswerType === AnswerTypesEnum.InputFloat ? 2 : 0
                      }
                    />
                    <Number
                      name={`answersAttributes[${index}].endValue`}
                      label={t('answer.endValue')}
                      isRequired
                      max={100}
                      precision={
                        watchAnswerType === AnswerTypesEnum.InputFloat ? 2 : 0
                      }
                    />
                  </React.Fragment>
                ) : (
                  <Number
                    name={`answersAttributes[${index}].value`}
                    label={t('answer.value')}
                    isRequired
                    max={100}
                    precision={
                      watchAnswerType === AnswerTypesEnum.InputFloat ? 2 : 0
                    }
                  />
                )}
              </React.Fragment>
            ) : (
              <Input
                name={`answersAttributes[${index}].value`}
                label={t('answer.value')}
                isRequired
              />
            )}
          </React.Fragment>
        )}
        <IconButton
          aria-label='delete'
          icon={<DeleteIcon />}
          variant='ghost'
          onClick={() => remove(index)}
        />
      </HStack>
    )
  }
  return null
}

export default AnswerLine
