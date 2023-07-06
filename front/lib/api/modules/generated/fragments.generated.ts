import * as Types from '../../../../types/graphql.d';

export type HstoreLanguagesFragment = { __typename?: 'Hstore', en?: string | null, fr?: string | null };

export type DiagnosisFieldsFragment = { __typename?: 'Diagnosis', id: string, levelOfUrgency: number, labelTranslations: { __typename?: 'Hstore', en?: string | null, fr?: string | null }, descriptionTranslations?: { __typename?: 'Hstore', en?: string | null, fr?: string | null } | null };

export type AlgorithmFieldsFragment = { __typename?: 'Algorithm', id: string, name: string, minimumAge: number, mode?: string | null, ageLimit: number, descriptionTranslations: { __typename?: 'Hstore', en?: string | null, fr?: string | null }, ageLimitMessageTranslations: { __typename?: 'Hstore', en?: string | null, fr?: string | null }, languages: Array<{ __typename?: 'Language', id: string, name: string, code: string }> };

export type AlgorithmListFieldsFragment = { __typename?: 'AlgorithmConnection', totalCount: number, pageInfo: { __typename?: 'PageInfo', hasNextPage: boolean, hasPreviousPage: boolean, endCursor?: string | null, startCursor?: string | null }, edges: Array<{ __typename?: 'AlgorithmEdge', node: { __typename?: 'Algorithm', status: string, updatedAt?: any | null, id: string, name: string, minimumAge: number, mode?: string | null, ageLimit: number, descriptionTranslations: { __typename?: 'Hstore', en?: string | null, fr?: string | null }, ageLimitMessageTranslations: { __typename?: 'Hstore', en?: string | null, fr?: string | null }, languages: Array<{ __typename?: 'Language', id: string, name: string, code: string }> } }> };

export type DecisionTreeFieldsFragment = { __typename?: 'DecisionTree', cutOffStart?: number | null, cutOffEnd?: number | null, labelTranslations: { __typename?: 'Hstore', en?: string | null, fr?: string | null }, node: { __typename?: 'Variable', id: string, labelTranslations: { __typename?: 'Hstore', en?: string | null, fr?: string | null } } };

export type DecisionTreeListFieldsFragment = { __typename?: 'DecisionTreeConnection', totalCount: number, pageInfo: { __typename?: 'PageInfo', hasNextPage: boolean, hasPreviousPage: boolean, endCursor?: string | null, startCursor?: string | null }, edges: Array<{ __typename?: 'DecisionTreeEdge', node: { __typename?: 'DecisionTree', id: string, labelTranslations: { __typename?: 'Hstore', en?: string | null, fr?: string | null }, node: { __typename?: 'Variable', labelTranslations: { __typename?: 'Hstore', en?: string | null, fr?: string | null } } } }> };

export type DrugFieldsFragment = { __typename?: 'Drug', id: string, isNeonat: boolean, isAntibiotic: boolean, isAntiMalarial: boolean, isDefault: boolean, hasInstances?: boolean | null, labelTranslations: { __typename?: 'Hstore', en?: string | null, fr?: string | null } };

export type DrugFormulationFieldsFragment = { __typename?: 'Formulation', id: string, byAge?: boolean | null, breakable?: Types.BreakableEnum | null, uniqueDose?: number | null, liquidConcentration?: number | null, medicationForm: Types.MedicationFormEnum, doseForm?: number | null, maximalDose?: number | null, minimalDosePerKg?: number | null, maximalDosePerKg?: number | null, dosesPerDay?: number | null, administrationRoute: { __typename?: 'AdministrationRoute', id: string, category: string, nameTranslations: { __typename?: 'Hstore', en?: string | null, fr?: string | null } }, injectionInstructionsTranslations?: { __typename?: 'Hstore', en?: string | null, fr?: string | null } | null, dispensingDescriptionTranslations?: { __typename?: 'Hstore', en?: string | null, fr?: string | null } | null, descriptionTranslations?: { __typename?: 'Hstore', en?: string | null, fr?: string | null } | null };

export type InstanceFieldsFragment = { __typename?: 'Instance', id: string, diagramName?: string | null, instanceableType: string, instanceableId: string, diagnosisId?: string | null };

export type NodeFieldsFragment = { __typename?: 'Node', id: string, category: string, isNeonat: boolean, labelTranslations: { __typename?: 'Hstore', en?: string | null, fr?: string | null }, excludingNodes: Array<{ __typename?: 'Node', id: string }>, diagramAnswers: Array<{ __typename?: 'Answer', id: string, labelTranslations: { __typename?: 'Hstore', en?: string | null, fr?: string | null } }> };

export type ComponentFieldsFragment = { __typename?: 'Instance', id: string, positionX: number, positionY: number, conditions: Array<{ __typename?: 'Condition', id: string, cutOffStart?: number | null, cutOffEnd?: number | null, score?: number | null, answer: { __typename?: 'Answer', id: string, nodeId: string } }>, node: { __typename?: 'Node', id: string, category: string, isNeonat: boolean, labelTranslations: { __typename?: 'Hstore', en?: string | null, fr?: string | null }, excludingNodes: Array<{ __typename?: 'Node', id: string }>, diagramAnswers: Array<{ __typename?: 'Answer', id: string, labelTranslations: { __typename?: 'Hstore', en?: string | null, fr?: string | null } }> } };

export type ManagementFieldsFragment = { __typename?: 'Management', id: string, isNeonat: boolean, isReferral?: boolean | null, levelOfUrgency?: number | null, isDefault: boolean, hasInstances?: boolean | null, descriptionTranslations?: { __typename?: 'Hstore', en?: string | null, fr?: string | null } | null, labelTranslations: { __typename?: 'Hstore', en?: string | null, fr?: string | null }, files: Array<{ __typename?: 'File', id: string, name: string, size: number, url: string, extension: string }> };

export type ProjectFieldsFragment = { __typename?: 'Project', id: string, name: string, isCurrentUserAdmin?: boolean | null };

export type UserFieldsFragment = { __typename?: 'User', id: string, firstName: string, lastName: string, email: string, role: Types.RoleEnum };

export type VariableFieldsFragment = { __typename?: 'Variable', id: string, isNeonat: boolean, hasInstances?: boolean | null, isDefault: boolean, type: Types.VariableCategoryEnum, labelTranslations: { __typename?: 'Hstore', en?: string | null, fr?: string | null }, answerType: { __typename?: 'AnswerType', value: string, labelKey: string } };

export const HstoreLanguagesFragmentDoc = `
    fragment HstoreLanguages on Hstore {
  en
  fr
}
    `;
export const DiagnosisFieldsFragmentDoc = `
    fragment DiagnosisFields on Diagnosis {
  id
  labelTranslations {
    ...HstoreLanguages
  }
  descriptionTranslations {
    ...HstoreLanguages
  }
  levelOfUrgency
}
    ${HstoreLanguagesFragmentDoc}`;
export const AlgorithmFieldsFragmentDoc = `
    fragment AlgorithmFields on Algorithm {
  id
  name
  minimumAge
  descriptionTranslations {
    ...HstoreLanguages
  }
  mode
  ageLimit
  ageLimitMessageTranslations {
    ...HstoreLanguages
  }
  languages {
    id
    name
    code
  }
}
    ${HstoreLanguagesFragmentDoc}`;
export const AlgorithmListFieldsFragmentDoc = `
    fragment AlgorithmListFields on AlgorithmConnection {
  pageInfo {
    hasNextPage
    hasPreviousPage
    endCursor
    startCursor
  }
  totalCount
  edges {
    node {
      ...AlgorithmFields
      status
      updatedAt
    }
  }
}
    ${AlgorithmFieldsFragmentDoc}`;
export const DecisionTreeFieldsFragmentDoc = `
    fragment DecisionTreeFields on DecisionTree {
  labelTranslations {
    ...HstoreLanguages
  }
  node {
    id
    labelTranslations {
      ...HstoreLanguages
    }
  }
  cutOffStart
  cutOffEnd
}
    ${HstoreLanguagesFragmentDoc}`;
export const DecisionTreeListFieldsFragmentDoc = `
    fragment DecisionTreeListFields on DecisionTreeConnection {
  pageInfo {
    hasNextPage
    hasPreviousPage
    endCursor
    startCursor
  }
  totalCount
  edges {
    node {
      id
      labelTranslations {
        ...HstoreLanguages
      }
      node {
        labelTranslations {
          ...HstoreLanguages
        }
      }
    }
  }
}
    ${HstoreLanguagesFragmentDoc}`;
export const DrugFieldsFragmentDoc = `
    fragment DrugFields on Drug {
  id
  isNeonat
  isAntibiotic
  isAntiMalarial
  isDefault
  hasInstances
  labelTranslations {
    ...HstoreLanguages
  }
}
    ${HstoreLanguagesFragmentDoc}`;
export const DrugFormulationFieldsFragmentDoc = `
    fragment DrugFormulationFields on Formulation {
  id
  byAge
  breakable
  uniqueDose
  liquidConcentration
  medicationForm
  doseForm
  maximalDose
  minimalDosePerKg
  maximalDosePerKg
  dosesPerDay
  administrationRoute {
    id
    category
    nameTranslations {
      ...HstoreLanguages
    }
  }
  injectionInstructionsTranslations {
    ...HstoreLanguages
  }
  dispensingDescriptionTranslations {
    ...HstoreLanguages
  }
  descriptionTranslations {
    ...HstoreLanguages
  }
}
    ${HstoreLanguagesFragmentDoc}`;
export const InstanceFieldsFragmentDoc = `
    fragment InstanceFields on Instance {
  id
  diagramName
  instanceableType
  instanceableId
  diagnosisId
}
    `;
export const NodeFieldsFragmentDoc = `
    fragment NodeFields on Node {
  id
  labelTranslations {
    ...HstoreLanguages
  }
  excludingNodes {
    id
  }
  category
  isNeonat
  diagramAnswers {
    id
    labelTranslations {
      ...HstoreLanguages
    }
  }
}
    ${HstoreLanguagesFragmentDoc}`;
export const ComponentFieldsFragmentDoc = `
    fragment ComponentFields on Instance {
  id
  positionX
  positionY
  conditions {
    id
    answer {
      id
      nodeId
    }
    cutOffStart
    cutOffEnd
    score
  }
  node {
    ...NodeFields
  }
}
    ${NodeFieldsFragmentDoc}`;
export const ManagementFieldsFragmentDoc = `
    fragment ManagementFields on Management {
  id
  descriptionTranslations {
    ...HstoreLanguages
  }
  labelTranslations {
    ...HstoreLanguages
  }
  isNeonat
  isReferral
  levelOfUrgency
  isDefault
  hasInstances
  files {
    id
    name
    size
    url
    extension
  }
}
    ${HstoreLanguagesFragmentDoc}`;
export const ProjectFieldsFragmentDoc = `
    fragment ProjectFields on Project {
  id
  name
  isCurrentUserAdmin
}
    `;
export const UserFieldsFragmentDoc = `
    fragment UserFields on User {
  id
  firstName
  lastName
  email
  role
}
    `;
export const VariableFieldsFragmentDoc = `
    fragment VariableFields on Variable {
  id
  isNeonat
  hasInstances
  isDefault
  labelTranslations {
    ...HstoreLanguages
  }
  answerType {
    value
    labelKey
  }
  type
}
    ${HstoreLanguagesFragmentDoc}`;
