/**
 * The external imports
 */
import * as yup from 'yup'

/**
 * The internal imports
 */
import { HSTORE_LANGUAGES } from '@/lib/config/constants'
import { QuestionsSequenceCategoryEnum, CutOffValueTypesEnum } from '@/types'
import { extractTranslation } from '@/lib/utils/string'
import type {
  CustomTFunction,
  Languages,
  QuestionsSequenceInputs,
} from '@/types'
import type { GetQuestionsSequence } from '@/lib/api/modules/enhanced/questionSequences.enhanced'

class QuestionsSequence {
  private static instance: QuestionsSequence

  public static getInstance(): QuestionsSequence {
    if (!QuestionsSequence.instance) {
      QuestionsSequence.instance = new QuestionsSequence()
    }

    return QuestionsSequence.instance
  }

  public buildFormData = (
    questionsSequence: GetQuestionsSequence,
    projectLanguageCode: string
  ): QuestionsSequenceInputs => {
    return {
      label: extractTranslation(
        questionsSequence.labelTranslations,
        projectLanguageCode
      ),
      description: extractTranslation(
        questionsSequence.descriptionTranslations,
        projectLanguageCode
      ),
      type: questionsSequence.type,
      cutOffStart: questionsSequence.cutOffStart,
      cutOffEnd: questionsSequence.cutOffEnd,
      minScore: questionsSequence.minScore,
      complaintCategoryOptions: questionsSequence.nodeComplaintCategories?.map(
        NCC => ({
          value: String(NCC.complaintCategory.id),
          label: extractTranslation(
            NCC.complaintCategory.labelTranslations,
            projectLanguageCode
          ),
        })
      ),
    }
  }

  public transformData = (
    data: QuestionsSequenceInputs,
    projectLanguageCode: string | undefined
  ) => {
    const tmpData = structuredClone(data)

    const descriptionTranslations: Languages = {}
    const labelTranslations: Languages = {}
    HSTORE_LANGUAGES.forEach(language => {
      descriptionTranslations[language] =
        language === projectLanguageCode && tmpData.description
          ? tmpData.description
          : ''
    })
    HSTORE_LANGUAGES.forEach(language => {
      labelTranslations[language] =
        language === projectLanguageCode && tmpData.label ? tmpData.label : ''
    })

    const complaintCategoryIds = tmpData.complaintCategoryOptions?.map(
      cc => cc.value
    )

    delete tmpData.description
    delete tmpData.label
    delete tmpData.complaintCategoryOptions

    return {
      ...tmpData,
      complaintCategoryIds,
      descriptionTranslations,
      labelTranslations,
    }
  }

  /**
   * Returns a Yup validation schema for the QuestionsSequence object.
   * @param t translation function
   * @returns yupSchema
   */
  public getValidationSchema(
    t: CustomTFunction<'QuestionsSequences'>
  ): yup.ObjectSchema<QuestionsSequenceInputs> {
    return yup.object({
      type: yup
        .mixed<QuestionsSequenceCategoryEnum>()
        .oneOf(Object.values(QuestionsSequenceCategoryEnum))
        .label(t('type'))
        .required(),
      label: yup.string().label(t('label')).required(),
      description: yup.string().label(t('description')),
      complaintCategoryIds: yup.array().label(t('complaintCategories')),
      complaintCategoryOptions: yup.array().label(t('complaintCategories')),
      cutOffValueType: yup
        .mixed<CutOffValueTypesEnum>()
        .oneOf(Object.values(CutOffValueTypesEnum))
        .label(t('cutOffValueType'))
        .required(),
      cutOffStart: yup
        .number()
        .transform(value => (isNaN(value) ? undefined : value))
        .nullable(),
      cutOffEnd: yup
        .number()
        .transform(value => (isNaN(value) ? undefined : value))
        .nullable(),
      minScore: yup
        .number()
        .nullable()
        .label(t('minScore'))
        .when('type', {
          is: (type: QuestionsSequenceCategoryEnum) =>
            type === QuestionsSequenceCategoryEnum.Scored,
          then: schema => schema.required(),
        }),
    })
  }
}

export default QuestionsSequence.getInstance()
