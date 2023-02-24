/**
 * The internal imports
 */
import type { MenuOptions } from "@/types/common"

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
