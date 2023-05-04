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
  ComplaintCategory = 'Variables::ComplaintCategory',
  BackgroundCalculation = 'Variables::BackgroundCalculation',
  BasicMeasurement = 'Variables::BasicMeasurement',
  Vaccine = 'Variables::Vaccine',
  VitalSignAnthropometric = 'Variables::VitalSignAnthropometric',
  ChronicCondition = 'Variables::ChronicCondition',
  Exposure = 'Variables::Exposure',
  ObservedPhysicalSign = 'Variables::ObservedPhysicalSign',
  PhysicalExam = 'Variables::PhysicalExam',
  Symptom = 'Variables::Symptom',
  BasicDemographic = 'Variables::BasicDemographic',
  AssessmentTest = 'Variables::AssessmentTest',
  Demographic = 'Variables::Demographic',
}

export enum RoundsEnum {
  Tenth,
  Half,
  Unit,
}

export enum EmergencyStatusesEnum {
  Standard,
  Referral,
  Emergency,
  EmergencyIfNo,
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

export enum SystemsEnum {}

/************************************************************** */
// TODO: CLEAR These constants and improve it
/************************************************************** */

// Conditional input display for variables
export const CATEGORIES_DISABLING_ANSWER_TYPE = [
  VariableTypesEnum.ComplaintCategory,
  VariableTypesEnum.BackgroundCalculation,
  VariableTypesEnum.BasicMeasurement,
  VariableTypesEnum.Vaccine,
  VariableTypesEnum.VitalSignAnthropometric,
]

export const CATEGORIES_DISPLAYING_SYSTEM = [
  VariableTypesEnum.ChronicCondition,
  VariableTypesEnum.Exposure,
  VariableTypesEnum.ObservedPhysicalSign,
  VariableTypesEnum.PhysicalExam,
  VariableTypesEnum.Symptom,
  VariableTypesEnum.Vaccine,
  VariableTypesEnum.VitalSignAnthropometric,
]

export const CATEGORIES_WITHOUT_ANSWERS = [
  VariableTypesEnum.VitalSignAnthropometric,
  VariableTypesEnum.BasicMeasurement,
  VariableTypesEnum.BasicDemographic,
]

export const CATEGORIES_DISPLAYING_ESTIMABLE_OPTION = [
  VariableTypesEnum.BasicMeasurement,
]

export const CATEGORIES_WITHOUT_COMPLAINT_CATEGORIES_OPTION = [
  VariableTypesEnum.ComplaintCategory,
]

export const CATEGORIES_DISPLAYING_UNAVAILABLE_OPTION = [
  VariableTypesEnum.AssessmentTest,
  VariableTypesEnum.BasicMeasurement,
  VariableTypesEnum.ChronicCondition,
  VariableTypesEnum.Exposure,
  VariableTypesEnum.PhysicalExam,
  VariableTypesEnum.Symptom,
  VariableTypesEnum.Vaccine,
  VariableTypesEnum.VitalSignAnthropometric,
]

export const CATEGORIES_WITHOUT_OPERATOR = [
  VariableTypesEnum.BasicMeasurement,
  VariableTypesEnum.VitalSignAnthropometric,
]

export const CATEGORIES_DISPLAYING_PREFILL = [
  VariableTypesEnum.BasicDemographic,
  VariableTypesEnum.Demographic,
]

// Translation propose
export const CATEGORIES_UNAVAILABLE_UNKNOWN = [
  VariableTypesEnum.ChronicCondition,
  VariableTypesEnum.Exposure,
  VariableTypesEnum.Symptom,
  VariableTypesEnum.Vaccine,
]

// Translation propose
export const CATEGORIES_UNAVAILABLE_NOT_FEASIBLE = [
  VariableTypesEnum.BasicMeasurement,
  VariableTypesEnum.PhysicalExam,
  VariableTypesEnum.VitalSignAnthropometric,
]

export const NO_ANSWERS_ATTACHED_ANSWER_TYPE = [1, 6, 7, 8, 9]

export const NUMERIC_ANSWER_TYPES = [3, 4]

export const INPUT_ANSWER_TYPES = [3, 4, 6, 9]

export const INJECTION_ADMINISTRATION_ROUTES = [4, 5, 6]

export const MEDICAL_HISTORY_SYSTEMS = [
  'priority_sign',
  'general',
  'respiratory_circulation',
  'ear_nose_mouth_throat',
  'digestive',
  'feeding',
  'urinary_reproductive',
  'nervous',
  'visual',
  'muscular_skeletal',
  'integumentary',
  'exposures',
  'comorbidities',
  'complementary_medical_history',
  'prevention',
  'follow_up_questions',
  'fever',
  'dehydration',
  'malnutrition_anemia',
]

export const PHYSICAL_EXAM_SYSTEMS = [
  'vital_sign',
  'general',
  'respiratory_circulation',
  'ear_nose_mouth_throat',
  'digestive',
  'urinary_reproductive',
  'nervous',
  'visual',
  'muscular_skeletal',
  'integumentary',
  'complementary_medical_history',
  'fever',
  'dehydration',
  'malnutrition_anemia',
]

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
