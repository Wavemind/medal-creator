/**
 * The internal imports
 */
import { Accept } from 'react-dropzone'

/**
 * The internal imports
 */
import type { Columns, MenuOptions } from '@/types'

export enum Role {
  Admin = 'admin',
  Clinician = 'clinician',
  DeploymentManager = 'deployment_manager',
}

export enum FileExtensionsAuthorized {
  Mp3 = '.mp3',
  Jpg = '.jpg',
  Jpeg = '.jpeg',
  Png = '.png',
}

export const FILE_EXTENSIONS_AUTHORIZED: Accept = {
  'audio/mpeg': ['.mp3'],
  'image/jpeg': ['.jpg', '.jpeg'],
  'image/png': [],
}

export const HSTORE_LANGUAGES = ['fr', 'en']
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

export const TABLE_COLUMNS: Columns = {
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
      accessorKey: 'category',
    },
    {
      accessorKey: 'answerType',
    },
    {
      accessorKey: 'isNeonat',
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

export enum VariableTypesEnum {
  AnswerableBasicMeasurement = 'Variables::AnswerableBasicMeasurement',
  AssessmentTest = 'Variables::AssessmentTest',
  BackgroundCalculation = 'Variables::BackgroundCalculation',
  BasicDemographic = 'Variables::BasicDemographic',
  BasicMeasurement = 'Variables::BasicMeasurement',
  ChronicCondition = 'Variables::ChronicCondition',
  ComplaintCategory = 'Variables::ComplaintCategory',
  Demographic = 'Variables::Demographic',
  Exposure = 'Variables::Exposure',
  ObservedPhysicalSign = 'Variables::ObservedPhysicalSign',
  PhysicalExam = 'Variables::PhysicalExam',
  Referral = 'Variables::Referral',
  Symptom = 'Variables::Symptom',
  TreatmentQuestion = 'Variables::TreatmentQuestion',
  UniqueTriageQuestion = 'Variables::UniqueTriageQuestion',
  Vaccine = 'Variables::Vaccine',
  VitalSignAnthropometric = 'Variables::VitalSignAnthropometric',
}

export enum RoundsEnum {
  Tenth = 'tenth',
  Half = 'half',
  Unit = 'unit',
}

export enum OperatorsEnum {
  Less = 'less',
  Between = 'between',
  MoreOrEqual = 'more_or_equal',
}

export enum EmergencyStatusesEnum {
  Standard = 'standard',
  Referral = 'referral',
  Emergency = 'emergency',
  EmergencyIfNo = 'emergency_if_no',
}

export enum StepsEnum {
  RegistrationStep = 'RegistrationStep',
  FirstLookAssesmentStep = 'FirstLookAssesmentStep',
  ComplaintCategoriesStep = 'ComplaintCategoriesStep',
  BasicMeasurementStep = 'BasicMeasurementStep',
  MedicalHistoryStep = 'MedicalHistoryStep',
  PhysicalExamStep = 'PhysicalExamStep',
  TestStep = 'TestStep',
  HealthCareQuestionsStep = 'HealthCareQuestionsStep',
  ReferralStep = 'ReferralStep',
}

export enum StagesEnum {
  Registration = 'Registration',
  Triage = 'Triage',
  Test = 'Test',
  Consultation = 'Consultation',
  DiagnosisManagement = 'DiagnosisManagement',
}

export enum SystemsEnum {
  General = 'general',
  RespiratoryCirculation = 'respiratoryCirculation',
  EarNoseMouthThroat = 'earNoseMouthThroat',
  Visual = 'visual',
  Integumentary = 'integumentary',
  Digestive = 'digestive',
  UrinaryReproductive = 'urinaryReproductive',
  Nervous = 'nervous',
  MuscularSkeletal = 'muscularSkeletal',
  Exposures = 'exposures',
  ChronicConditions = 'chronicConditions',
  Comorbidities = 'comorbidities',
  Prevention = 'prevention',
  FollowUpQuestions = 'followUpQuestions',
  ComplementaryMedicalHistory = 'complementaryMedicalHistory',
  VitalSign = 'vitalSign',
  PrioritySign = 'prioritySign',
  Feeding = 'feeding',
  Fever = 'fever',
  Dehydration = 'dehydration',
  MalnutritionAnemia = 'malnutritionAnemia',
}

export const CATEGORY_TO_STAGE_MAP: Record<
  Exclude<VariableTypesEnum, VariableTypesEnum.BackgroundCalculation>,
  StagesEnum
> = {
  [VariableTypesEnum.BasicDemographic]: StagesEnum.Registration,
  [VariableTypesEnum.Demographic]: StagesEnum.Registration,
  [VariableTypesEnum.BasicMeasurement]: StagesEnum.Triage,
  [VariableTypesEnum.AnswerableBasicMeasurement]: StagesEnum.Triage,
  [VariableTypesEnum.UniqueTriageQuestion]: StagesEnum.Triage,
  [VariableTypesEnum.ComplaintCategory]: StagesEnum.Triage,
  [VariableTypesEnum.AssessmentTest]: StagesEnum.Test,
  [VariableTypesEnum.ChronicCondition]: StagesEnum.Consultation,
  [VariableTypesEnum.Exposure]: StagesEnum.Consultation,
  [VariableTypesEnum.ObservedPhysicalSign]: StagesEnum.Consultation,
  [VariableTypesEnum.PhysicalExam]: StagesEnum.Consultation,
  [VariableTypesEnum.Symptom]: StagesEnum.Consultation,
  [VariableTypesEnum.Vaccine]: StagesEnum.Consultation,
  [VariableTypesEnum.VitalSignAnthropometric]: StagesEnum.Consultation,
  [VariableTypesEnum.Referral]: StagesEnum.DiagnosisManagement,
  [VariableTypesEnum.TreatmentQuestion]: StagesEnum.DiagnosisManagement,
}

export const MEDICAL_HISTORY_SYSTEMS: SystemsEnum[] = [
  SystemsEnum.PrioritySign,
  SystemsEnum.General,
  SystemsEnum.RespiratoryCirculation,
  SystemsEnum.EarNoseMouthThroat,
  SystemsEnum.Digestive,
  SystemsEnum.Feeding,
  SystemsEnum.UrinaryReproductive,
  SystemsEnum.Nervous,
  SystemsEnum.Visual,
  SystemsEnum.MuscularSkeletal,
  SystemsEnum.Integumentary,
  SystemsEnum.Exposures,
  SystemsEnum.Comorbidities,
  SystemsEnum.ComplementaryMedicalHistory,
  SystemsEnum.Prevention,
  SystemsEnum.FollowUpQuestions,
  SystemsEnum.Fever,
  SystemsEnum.Dehydration,
  SystemsEnum.MalnutritionAnemia,
]

export const PHYSICAL_EXAM_SYSTEMS: SystemsEnum[] = [
  SystemsEnum.VitalSign,
  SystemsEnum.General,
  SystemsEnum.RespiratoryCirculation,
  SystemsEnum.EarNoseMouthThroat,
  SystemsEnum.Digestive,
  SystemsEnum.UrinaryReproductive,
  SystemsEnum.Nervous,
  SystemsEnum.Visual,
  SystemsEnum.MuscularSkeletal,
  SystemsEnum.Integumentary,
  SystemsEnum.ComplementaryMedicalHistory,
  SystemsEnum.Fever,
  SystemsEnum.Dehydration,
  SystemsEnum.MalnutritionAnemia,
]

export const CATEGORY_TO_SYSTEM_MAP: Record<
  Extract<
    VariableTypesEnum,
    | VariableTypesEnum.ChronicCondition
    | VariableTypesEnum.Exposure
    | VariableTypesEnum.ObservedPhysicalSign
    | VariableTypesEnum.Symptom
    | VariableTypesEnum.Vaccine
    | VariableTypesEnum.VitalSignAnthropometric
    | VariableTypesEnum.PhysicalExam
  >,
  SystemsEnum[]
> = {
  [VariableTypesEnum.ChronicCondition]: MEDICAL_HISTORY_SYSTEMS,
  [VariableTypesEnum.Exposure]: MEDICAL_HISTORY_SYSTEMS,
  [VariableTypesEnum.ObservedPhysicalSign]: MEDICAL_HISTORY_SYSTEMS,
  [VariableTypesEnum.Symptom]: MEDICAL_HISTORY_SYSTEMS,
  [VariableTypesEnum.Vaccine]: MEDICAL_HISTORY_SYSTEMS,
  [VariableTypesEnum.VitalSignAnthropometric]: MEDICAL_HISTORY_SYSTEMS,
  [VariableTypesEnum.PhysicalExam]: PHYSICAL_EXAM_SYSTEMS,
}

// Conditional input display for variables
export const CATEGORIES_DISABLING_ANSWER_TYPE: VariableTypesEnum[] = [
  VariableTypesEnum.ComplaintCategory,
  VariableTypesEnum.BackgroundCalculation,
  VariableTypesEnum.BasicMeasurement,
  VariableTypesEnum.Vaccine,
  VariableTypesEnum.VitalSignAnthropometric,
]

export const CATEGORIES_DISPLAYING_SYSTEM: VariableTypesEnum[] = [
  VariableTypesEnum.ChronicCondition,
  VariableTypesEnum.Exposure,
  VariableTypesEnum.ObservedPhysicalSign,
  VariableTypesEnum.PhysicalExam,
  VariableTypesEnum.Symptom,
  VariableTypesEnum.Vaccine,
  VariableTypesEnum.VitalSignAnthropometric,
]

export const CATEGORIES_WITHOUT_ANSWERS: VariableTypesEnum[] = [
  VariableTypesEnum.VitalSignAnthropometric,
  VariableTypesEnum.BasicMeasurement,
  VariableTypesEnum.BasicDemographic,
]

export const CATEGORIES_DISPLAYING_ESTIMABLE_OPTION: VariableTypesEnum[] = [
  VariableTypesEnum.BasicMeasurement,
]

export const CATEGORIES_WITHOUT_COMPLAINT_CATEGORIES_OPTION: VariableTypesEnum[] =
  [VariableTypesEnum.ComplaintCategory]

export const CATEGORIES_DISPLAYING_UNAVAILABLE_OPTION: VariableTypesEnum[] = [
  VariableTypesEnum.AssessmentTest,
  VariableTypesEnum.BasicMeasurement,
  VariableTypesEnum.ChronicCondition,
  VariableTypesEnum.Exposure,
  VariableTypesEnum.PhysicalExam,
  VariableTypesEnum.Symptom,
  VariableTypesEnum.Vaccine,
  VariableTypesEnum.VitalSignAnthropometric,
]

export const CATEGORIES_WITHOUT_OPERATOR: VariableTypesEnum[] = [
  VariableTypesEnum.BasicMeasurement,
  VariableTypesEnum.VitalSignAnthropometric,
]

export const CATEGORIES_DISPLAYING_PREFILL: VariableTypesEnum[] = [
  VariableTypesEnum.BasicDemographic,
  VariableTypesEnum.Demographic,
]

export const CATEGORIES_WITHOUT_STAGE: VariableTypesEnum[] = [
  VariableTypesEnum.BackgroundCalculation,
]

// Translation propose
export const CATEGORIES_UNAVAILABLE_UNKNOWN: VariableTypesEnum[] = [
  VariableTypesEnum.ChronicCondition,
  VariableTypesEnum.Exposure,
  VariableTypesEnum.Symptom,
  VariableTypesEnum.Vaccine,
]

// Translation propose
export const CATEGORIES_UNAVAILABLE_NOT_FEASIBLE: VariableTypesEnum[] = [
  VariableTypesEnum.BasicMeasurement,
  VariableTypesEnum.PhysicalExam,
  VariableTypesEnum.VitalSignAnthropometric,
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

// NOT USED
export const INJECTION_ADMINISTRATION_ROUTES = [4, 5, 6]

// NOT USED
export const FIXED_DOSE_FORMULATIONS = [
  'suppository',
  'drops',
  'patch',
  'cream',
  'ointment',
  'gel',
  'spray',
  'inhaler',
  'pessary',
  'lotion',
]
