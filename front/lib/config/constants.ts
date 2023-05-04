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
