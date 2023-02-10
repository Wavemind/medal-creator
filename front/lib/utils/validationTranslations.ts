/**
 * The external imports
 */
import { TFunction } from "i18next";
import { setLocale } from "yup";

const validationTranslations = (t: TFunction) => {
  const required = t("required", { ns: 'validations' })
  const emailValid = t("email", { ns: 'validations' })
  const minString = t("minString", { ns: 'validations' })
  const maxString = t("maxString", { ns: 'validations' })
  const minNumber = t("minNumber", { ns: 'validations' })
  const maxNumber = t("maxNumber", { ns: 'validations' })

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
  });
};

export default validationTranslations
