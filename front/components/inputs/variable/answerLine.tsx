/**
 * The external imports
 */
import React, { useEffect, useMemo } from 'react'
import { HStack, IconButton } from '@chakra-ui/react'
import { useTranslation } from 'next-i18next'
import { useFormContext } from 'react-hook-form'

/**
 * The internal imports
 */
import DeleteIcon from '@/assets/icons/Delete'
import Input from '@/components/inputs/input'
import Number from '@/components/inputs/number'
import Select from '@/components/inputs/select'
import { useGetProjectQuery } from '@/lib/api/modules/enhanced/project.enhanced'
import VariableService from '@/lib/services/variable.service'
import {
  CATEGORIES_WITHOUT_OPERATOR,
  ANSWER_TYPE_WITHOUT_OPERATOR_AND_ANSWER,
  AnswerTypesEnum,
} from '@/lib/config/constants'
import { VariableCategoryEnum, OperatorEnum } from '@/types'
import type { AnswerInputs, AnswerLineComponent } from '@/types'

const AnswerLine: AnswerLineComponent = ({
  field,
  index,
  projectId,
  handleRemove,
}) => {
  const { t } = useTranslation('variables')

  const { watch, getValues, unregister } = useFormContext()

  const watchAnswerType: number = parseInt(watch('answerType'))
  const watchCategory: VariableCategoryEnum = watch('type')
  const watchFieldArray: Array<AnswerInputs> = watch('answersAttributes')
  const watchOperator: OperatorEnum = watch(
    `answersAttributes[${index}].operator`
  )

  const { data: project, isSuccess: isGetProjectSuccess } = useGetProjectQuery({
    id: projectId,
  })

  /**
   * Calculate available operators
   */
  const operators = useMemo(() => {
    let availableOperators = VariableService.operators

    if (
      watchFieldArray.some(
        (field, i) =>
          field.operator === OperatorEnum.Less && i !== index && !field._destroy
      )
    ) {
      availableOperators = availableOperators.filter(
        operator => operator !== OperatorEnum.Less
      )
    }

    if (
      watchFieldArray.some(
        (field, i) =>
          field.operator === OperatorEnum.MoreOrEqual &&
          i !== index &&
          !field._destroy
      )
    ) {
      availableOperators = availableOperators.filter(
        operator => operator !== OperatorEnum.MoreOrEqual
      )
    }

    return availableOperators.map(operator => ({
      value: operator,
      label: t(`answer.operators.${operator}`, { defaultValue: '' }),
    }))
  }, [watchFieldArray])

  /**
   * Change value input on the fly based on operator selected
   */
  useEffect(() => {
    const fieldValues = getValues(`answersAttributes[${index}]`)
    if (fieldValues.operator === OperatorEnum.Between) {
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
      <HStack w='full' spacing={4}>
        <HStack key={field.id} alignItems='flex-start' w='full' spacing={4}>
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
          {!ANSWER_TYPE_WITHOUT_OPERATOR_AND_ANSWER.includes(
            watchAnswerType
          ) && (
            <React.Fragment>
              {!CATEGORIES_WITHOUT_OPERATOR.includes(watchCategory) ? (
                <React.Fragment>
                  <Select
                    label={t('answer.operator')}
                    options={operators}
                    name={`answersAttributes[${index}].operator`}
                    isRequired
                  />
                  {watchFieldArray[index]?.operator === OperatorEnum.Between ? (
                    <React.Fragment>
                      <Number
                        name={`answersAttributes[${index}].startValue`}
                        label={t('answer.startValue')}
                        isRequired
                        precision={
                          watchAnswerType === AnswerTypesEnum.InputFloat ? 2 : 0
                        }
                      />
                      <Number
                        name={`answersAttributes[${index}].endValue`}
                        label={t('answer.endValue')}
                        isRequired
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
                      precision={
                        watchAnswerType === AnswerTypesEnum.InputFloat ? 2 : 0
                      }
                    />
                  )}
                </React.Fragment>
              ) : (
                <Number
                  name={`answersAttributes[${index}].value`}
                  label={t('answer.value')}
                  isRequired
                  precision={2}
                />
              )}
            </React.Fragment>
          )}
        </HStack>
        <IconButton
          aria-label='delete'
          icon={<DeleteIcon />}
          variant='ghost'
          data-cy={`delete-answer-${index}`}
          onClick={() => handleRemove(index)}
        />
      </HStack>
    )
  }
  return null
}

export default AnswerLine
