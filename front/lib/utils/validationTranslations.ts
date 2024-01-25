/**
 * The external imports
 */
import { setLocale } from 'yup'
import type { TFunction } from 'i18next'

export const validationTranslations = (t: TFunction<'validations'>): void => {
  const required = t('required', { ns: 'validations' })
  const emailValid = t('email', { ns: 'validations' })
  const minString = t('minString', { ns: 'validations' })
  const maxString = t('maxString', { ns: 'validations' })
  const minNumber = t('minNumber', { ns: 'validations' })
  const maxNumber = t('maxNumber', { ns: 'validations' })
  const minArray = t('minArray', { ns: 'validations' })
  const maxArray = t('maxArray', { ns: 'validations' })

  setLocale({
    mixed: {
      required: required,
    },
    string: {
      min: minString,
      max: maxString,
      email: emailValid,
    },
    number: {
      min: minNumber,
      max: maxNumber,
    },
    array: {
      min: minArray,
      max: maxArray,
    },
  })
}
