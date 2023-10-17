/**
 * The internal imports
 */
import { Accept } from 'react-dropzone'

/**
 * The internal imports
 */
import { SystemEnum, VariableCategoryEnum } from '@/types'
import type { TableColumns, MenuOptions, Languages } from '@/types'

export const FILE_EXTENSIONS_AUTHORIZED: Accept = {
  'audio/mpeg': ['.mp3'],
  'image/jpeg': ['.jpg', '.jpeg'],
  'image/png': [],
}

export const WEEK_DURATION = 7
export const MONTH_DURATION = 30.4375
export const YEAR_DURATION = 365.25

export const HSTORE_LANGUAGES: Array<keyof Languages> = ['fr', 'en']

export const TIMEOUT_INACTIVITY = 1000 * 60 * 60 // Logout after 60 minutes

export const LEVEL_OF_URGENCY_GRADIENT = [
  '#68d391',
  '#90da77',
  '#a8dd69',
  '#bff65e',
  '#dcf769',
  '#f4f979',
  '#fad585',
  '#fbbd8d',
  '#e98f6e',
  '#c53030',
]

export const TABLE_COLUMNS: TableColumns = {
  lastActivities: [
    {
      accessorKey: 'name',
    },
    {
      accessorKey: 'algorithm',
    },
    {
      accessorKey: 'complaintCategory',
    },
    {
      accessorKey: 'updatedAt',
    },
  ],
  algorithms: [
    {
      accessorKey: 'name',
    },
    {
      accessorKey: 'mode',
    },
    {
      accessorKey: 'status',
    },
    {
      accessorKey: 'updatedAt',
      colSpan: 3,
    },
  ],
  decisionTrees: [
    {
      accessorKey: 'name',
    },
    {
      accessorKey: 'complaintCategory',
    },
    {
      accessorKey: 'cutOff',
      colSpan: 2,
    },
  ],
  users: [
    {
      accessorKey: 'name',
    },
    {
      accessorKey: 'email',
    },
    {
      accessorKey: 'role',
    },
    {
      accessorKey: 'access',
      colSpan: 2,
    },
  ],
  variables: [
    {
      accessorKey: 'name',
    },
    {
      accessorKey: 'type',
    },
    {
      accessorKey: 'complaintCategory',
    },
    {
      accessorKey: 'answerType',
    },
    {
      accessorKey: 'isNeonat',
    },
  ],
  drugs: [
    {
      accessorKey: 'name',
    },
    {
      accessorKey: 'isAntibiotic',
    },
    {
      accessorKey: 'isAntiMalarial',
    },
    {
      accessorKey: 'isNeonat',
    },
  ],
  managements: [
    {
      accessorKey: 'name',
    },
    {
      accessorKey: 'isNeonat',
    },
    {
      accessorKey: 'isReferral',
    },
  ],
  medicalConditions: [
    {
      accessorKey: 'name',
    },
    {
      accessorKey: 'type',
    },
    {
      accessorKey: 'complaintCategory',
    },
  ],
}

export const MENU_OPTIONS: MenuOptions = {
  account: [
    {
      label: 'account.information',
      path: () => '/account/information',
      key: 'information',
    },
    {
      label: 'account.credentials',
      path: () => '/account/credentials',
      key: 'credentials',
    },
    {
      label: 'account.projects',
      path: () => '/account/projects',
      key: 'projects',
    },
  ],
  algorithm: [
    {
      label: 'algorithms.decision_tree_&_diagnoses',
      path: ({ projectId, algorithmId }) =>
        `/projects/${projectId}/algorithms/${algorithmId}`,
      key: 'decision_tree',
    },
    {
      label: 'algorithms.order',
      path: ({ projectId, algorithmId }) =>
        `/projects/${projectId}/algorithms/${algorithmId}/consultation-order`,
      key: 'order',
    },
    {
      label: 'algorithms.config',
      path: ({ projectId, algorithmId }) =>
        `/projects/${projectId}/algorithms/${algorithmId}/config`,
      key: 'config',
    },
    {
      label: 'algorithms.translations',
      path: ({ projectId, algorithmId }) =>
        `/projects/${projectId}/algorithms/${algorithmId}/translations`,
      key: 'translations',
    },
  ],
  library: [
    {
      label: 'library.variables',
      path: ({ projectId }) => `/projects/${projectId}/library`,
      key: 'variables',
    },
    {
      label: 'library.drugs',
      path: ({ projectId }) => `/projects/${projectId}/library/drugs`,
      key: 'drugs',
    },
    {
      label: 'library.managements',
      path: ({ projectId }) => `/projects/${projectId}/library/managements`,
      key: 'managements',
    },
    {
      label: 'library.medicalConditions',
      path: ({ projectId }) =>
        `/projects/${projectId}/library/medical-conditions`,
      key: 'medicalConditions',
    },
  ],
}

export enum StagesEnum {
  Registration = 'Registration',
  Triage = 'Triage',
  Test = 'Test',
  Consultation = 'Consultation',
  DiagnosisManagement = 'DiagnosisManagement',
}

export enum FormEnvironments {
  DecisionTreeDiagram,
  DiagnosisDiagram,
  QuestionSequenceDiagram,
  Default,
}

export const CATEGORY_TO_STAGE_MAP: Record<
  Exclude<VariableCategoryEnum, VariableCategoryEnum.BackgroundCalculation>,
  StagesEnum
> = {
  [VariableCategoryEnum.BasicDemographic]: StagesEnum.Registration,
  [VariableCategoryEnum.Demographic]: StagesEnum.Registration,
  [VariableCategoryEnum.BasicMeasurement]: StagesEnum.Triage,
  [VariableCategoryEnum.AnswerableBasicMeasurement]: StagesEnum.Triage,
  [VariableCategoryEnum.UniqueTriageQuestion]: StagesEnum.Triage,
  [VariableCategoryEnum.ComplaintCategory]: StagesEnum.Triage,
  [VariableCategoryEnum.AssessmentTest]: StagesEnum.Test,
  [VariableCategoryEnum.ChronicCondition]: StagesEnum.Consultation,
  [VariableCategoryEnum.Exposure]: StagesEnum.Consultation,
  [VariableCategoryEnum.ObservedPhysicalSign]: StagesEnum.Consultation,
  [VariableCategoryEnum.PhysicalExam]: StagesEnum.Consultation,
  [VariableCategoryEnum.Symptom]: StagesEnum.Consultation,
  [VariableCategoryEnum.Vaccine]: StagesEnum.Consultation,
  [VariableCategoryEnum.VitalSignAnthropometric]: StagesEnum.Consultation,
  [VariableCategoryEnum.Referral]: StagesEnum.DiagnosisManagement,
  [VariableCategoryEnum.TreatmentQuestion]: StagesEnum.DiagnosisManagement,
}

export const MEDICAL_HISTORY_SYSTEMS: SystemEnum[] = [
  SystemEnum.PrioritySign,
  SystemEnum.General,
  SystemEnum.RespiratoryCirculation,
  SystemEnum.EarNoseMouthThroat,
  SystemEnum.Digestive,
  SystemEnum.Feeding,
  SystemEnum.UrinaryReproductive,
  SystemEnum.Nervous,
  SystemEnum.Visual,
  SystemEnum.MuscularSkeletal,
  SystemEnum.Integumentary,
  SystemEnum.Exposures,
  SystemEnum.Comorbidities,
  SystemEnum.ComplementaryMedicalHistory,
  SystemEnum.Prevention,
  SystemEnum.FollowUpQuestions,
  SystemEnum.Fever,
  SystemEnum.Dehydration,
  SystemEnum.MalnutritionAnemia,
]

export const PHYSICAL_EXAM_SYSTEMS: SystemEnum[] = [
  SystemEnum.VitalSign,
  SystemEnum.General,
  SystemEnum.RespiratoryCirculation,
  SystemEnum.EarNoseMouthThroat,
  SystemEnum.Digestive,
  SystemEnum.UrinaryReproductive,
  SystemEnum.Nervous,
  SystemEnum.Visual,
  SystemEnum.MuscularSkeletal,
  SystemEnum.Integumentary,
  SystemEnum.ComplementaryMedicalHistory,
  SystemEnum.Fever,
  SystemEnum.Dehydration,
  SystemEnum.MalnutritionAnemia,
]

export const CATEGORY_AVAILABLE_DECISION_TREE: VariableCategoryEnum[] = [
  VariableCategoryEnum.AnswerableBasicMeasurement,
  VariableCategoryEnum.AssessmentTest,
  VariableCategoryEnum.BackgroundCalculation,
  VariableCategoryEnum.ChronicCondition,
  VariableCategoryEnum.ComplaintCategory,
  VariableCategoryEnum.Demographic,
  VariableCategoryEnum.Exposure,
  VariableCategoryEnum.ObservedPhysicalSign,
  VariableCategoryEnum.PhysicalExam,
  VariableCategoryEnum.Symptom,
  VariableCategoryEnum.UniqueTriageQuestion,
  VariableCategoryEnum.Vaccine,
]

export const CATEGORY_TO_SYSTEM_MAP: Record<
  Extract<
    VariableCategoryEnum,
    | VariableCategoryEnum.ChronicCondition
    | VariableCategoryEnum.Exposure
    | VariableCategoryEnum.ObservedPhysicalSign
    | VariableCategoryEnum.Symptom
    | VariableCategoryEnum.Vaccine
    | VariableCategoryEnum.VitalSignAnthropometric
    | VariableCategoryEnum.PhysicalExam
  >,
  SystemEnum[]
> = {
  [VariableCategoryEnum.ChronicCondition]: MEDICAL_HISTORY_SYSTEMS,
  [VariableCategoryEnum.Exposure]: MEDICAL_HISTORY_SYSTEMS,
  [VariableCategoryEnum.ObservedPhysicalSign]: MEDICAL_HISTORY_SYSTEMS,
  [VariableCategoryEnum.Symptom]: MEDICAL_HISTORY_SYSTEMS,
  [VariableCategoryEnum.Vaccine]: MEDICAL_HISTORY_SYSTEMS,
  [VariableCategoryEnum.VitalSignAnthropometric]: MEDICAL_HISTORY_SYSTEMS,
  [VariableCategoryEnum.PhysicalExam]: PHYSICAL_EXAM_SYSTEMS,
}

// Conditional input display for variables
export const CATEGORIES_DISABLING_ANSWER_TYPE: VariableCategoryEnum[] = [
  VariableCategoryEnum.ComplaintCategory,
  VariableCategoryEnum.BackgroundCalculation,
  VariableCategoryEnum.BasicMeasurement,
  VariableCategoryEnum.Vaccine,
  VariableCategoryEnum.VitalSignAnthropometric,
]

export const CATEGORIES_DISPLAYING_SYSTEM: VariableCategoryEnum[] = [
  VariableCategoryEnum.ChronicCondition,
  VariableCategoryEnum.Exposure,
  VariableCategoryEnum.ObservedPhysicalSign,
  VariableCategoryEnum.PhysicalExam,
  VariableCategoryEnum.Symptom,
  VariableCategoryEnum.Vaccine,
  VariableCategoryEnum.VitalSignAnthropometric,
]

export const CATEGORIES_WITHOUT_ANSWERS: VariableCategoryEnum[] = [
  VariableCategoryEnum.VitalSignAnthropometric,
  VariableCategoryEnum.BasicMeasurement,
]

export const CATEGORIES_DISPLAYING_ESTIMABLE_OPTION: VariableCategoryEnum[] = [
  VariableCategoryEnum.BasicMeasurement,
]

export const CATEGORIES_WITHOUT_COMPLAINT_CATEGORIES_OPTION: VariableCategoryEnum[] =
  [
    VariableCategoryEnum.ComplaintCategory,
    VariableCategoryEnum.UniqueTriageQuestion,
  ]

export const CATEGORIES_DISPLAYING_UNAVAILABLE_OPTION: VariableCategoryEnum[] =
  [
    VariableCategoryEnum.AssessmentTest,
    VariableCategoryEnum.BasicMeasurement,
    VariableCategoryEnum.ChronicCondition,
    VariableCategoryEnum.Exposure,
    VariableCategoryEnum.PhysicalExam,
    VariableCategoryEnum.Symptom,
    VariableCategoryEnum.Vaccine,
    VariableCategoryEnum.VitalSignAnthropometric,
  ]

export const CATEGORIES_WITHOUT_OPERATOR: VariableCategoryEnum[] = [
  VariableCategoryEnum.BasicMeasurement,
  VariableCategoryEnum.VitalSignAnthropometric,
]

export const CATEGORIES_DISPLAYING_PREFILL: VariableCategoryEnum[] = [
  VariableCategoryEnum.BasicDemographic,
  VariableCategoryEnum.Demographic,
]

export const CATEGORIES_WITHOUT_STAGE: VariableCategoryEnum[] = [
  VariableCategoryEnum.BackgroundCalculation,
]

// Translation propose
export const CATEGORIES_UNAVAILABLE_UNKNOWN: VariableCategoryEnum[] = [
  VariableCategoryEnum.ChronicCondition,
  VariableCategoryEnum.Exposure,
  VariableCategoryEnum.Symptom,
  VariableCategoryEnum.Vaccine,
]

// Translation propose
export const CATEGORIES_UNAVAILABLE_NOT_FEASIBLE: VariableCategoryEnum[] = [
  VariableCategoryEnum.BasicMeasurement,
  VariableCategoryEnum.PhysicalExam,
  VariableCategoryEnum.VitalSignAnthropometric,
]

export enum AnswerTypesEnum {
  RadioBoolean = 1,
  DropDownArray = 2,
  InputInteger = 3,
  InputFloat = 4,
  FormulaFloat = 5,
  InputDate = 6,
  RadioPresent = 7,
  RadioPositive = 8,
  InputString = 9,
}

export const DISPLAY_FORMULA_ANSWER_TYPE: AnswerTypesEnum[] = [
  AnswerTypesEnum.FormulaFloat,
]

export const DISPLAY_ROUND_ANSWER_TYPE: AnswerTypesEnum[] = [
  AnswerTypesEnum.InputFloat,
]

export const INPUT_ANSWER_TYPES: AnswerTypesEnum[] = [
  AnswerTypesEnum.InputInteger,
  AnswerTypesEnum.InputFloat,
  AnswerTypesEnum.InputDate,
  AnswerTypesEnum.InputString,
]

export const NUMERIC_ANSWER_TYPES: AnswerTypesEnum[] = [
  AnswerTypesEnum.InputInteger,
  AnswerTypesEnum.InputFloat,
]

export const ANSWER_TYPE_WITHOUT_OPERATOR_AND_ANSWER: AnswerTypesEnum[] = [
  AnswerTypesEnum.DropDownArray,
]

export const NO_ANSWERS_ATTACHED_ANSWER_TYPE: AnswerTypesEnum[] = [
  AnswerTypesEnum.RadioBoolean,
  AnswerTypesEnum.InputDate,
  AnswerTypesEnum.RadioPresent,
  AnswerTypesEnum.RadioPositive,
  AnswerTypesEnum.InputString,
]

export enum MedicationFormEnum {
  Tablet = 'tablet',
  Capsule = 'capsule',
  Syrup = 'syrup',
  Suspension = 'suspension',
  Suppository = 'suppository',
  Drops = 'drops',
  Solution = 'solution',
  PowderForInjection = 'powder_for_injection',
  Patch = 'patch',
  Cream = 'cream',
  Ointment = 'ointment',
  Gel = 'gel',
  Spray = 'spray',
  Inhaler = 'inhaler',
  Pessary = 'pessary',
  DispersibleTablet = 'dispersible_tablet',
  Lotion = 'lotion',
}

export const INJECTION_ADMINISTRATION_ROUTES = [4, 5, 6]

export const FIXED_DOSE_FORMULATIONS: MedicationFormEnum[] = [
  MedicationFormEnum.Suppository,
  MedicationFormEnum.Drops,
  MedicationFormEnum.Patch,
  MedicationFormEnum.Cream,
  MedicationFormEnum.Ointment,
  MedicationFormEnum.Gel,
  MedicationFormEnum.Spray,
  MedicationFormEnum.Inhaler,
  MedicationFormEnum.Pessary,
  MedicationFormEnum.Lotion,
]

export enum BreakableEnum {
  One = 'one',
  Two = 'two',
  Four = 'four',
}

export const DISPLAY_BREAKABLE: MedicationFormEnum[] = [
  MedicationFormEnum.Tablet,
  MedicationFormEnum.DispersibleTablet,
]

export const DISPLAY_UNIQUE_DOSE: MedicationFormEnum[] = [
  MedicationFormEnum.Suppository,
  MedicationFormEnum.Drops,
  MedicationFormEnum.Patch,
  MedicationFormEnum.Cream,
  MedicationFormEnum.Ointment,
  MedicationFormEnum.Gel,
  MedicationFormEnum.Spray,
  MedicationFormEnum.Inhaler,
  MedicationFormEnum.Pessary,
  MedicationFormEnum.Lotion,
]

export const DISPLAY_LIQUID_CONCENTRATION: MedicationFormEnum[] = [
  MedicationFormEnum.Suspension,
  MedicationFormEnum.Syrup,
  MedicationFormEnum.Solution,
  MedicationFormEnum.PowderForInjection,
]

export const DISPLAY_DOSE: MedicationFormEnum[] = [
  MedicationFormEnum.Capsule,
  MedicationFormEnum.Tablet,
  MedicationFormEnum.DispersibleTablet,
  MedicationFormEnum.Suspension,
  MedicationFormEnum.Syrup,
  MedicationFormEnum.Solution,
  MedicationFormEnum.PowderForInjection,
]

export const DEFAULT_FORMULA_ACTIONS = [
  { key: 'convertToMonth', value: '{ToMonth()}', caretActionPosition: 2 },
  { key: 'convertToDay', value: '{ToDay()}', caretActionPosition: 2 },
  { key: 'birthdateInMonths', value: '{ToMonth}', caretActionPosition: 0 },
  { key: 'birthdateInDays', value: '{ToDay}', caretActionPosition: 0 },
  { key: 'addVariable', value: '[]', caretActionPosition: 1 },
]

export enum EscapeFormulaActionsEnum {
  Backspace = 'Backspace',
  Space = ' ',
  Escape = 'Escape',
}
