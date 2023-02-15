// TODO : Generalize the translations like we do in the backend with HSTORE
export type DecisionTree = {
  id: number
  labelTranslations: {
    en: string
    fr: string
  }
  node: {
    labelTranslations: {
      en: string
      fr: string
    }
  }
}
