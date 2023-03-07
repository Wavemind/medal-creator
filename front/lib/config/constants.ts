/**
 * The internal imports
 */
import { Columns, MenuOptions } from '@/types'

export const enum Role {
  admin = 'admin',
  clinician = 'clinician',
  deploymentManager = 'deployment_manager',
}

export const DEFAULT_TABLE_PER_PAGE = 5
export const HSTORE_LANGUAGES = ['fr', 'en']
export const TIMEOUT_INACTIVITY = 1000 * 60 * 60 // Logout after 60 minutes

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
        `/projects/${projectId}/algorithms/${algorithmId}/order`,
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
}
