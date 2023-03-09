/**
 * The internal imports
 */
import { Columns, MenuOptions } from '@/types'
import { Accept } from 'react-dropzone'

export const enum Role {
  admin = 'admin',
  clinician = 'clinician',
  deploymentManager = 'deployment_manager',
}

// TODO: CLEAR THIS LIST WITH KNOWN USED IN PROD
export const enum FileExtensionsAuthorized {
  aac = '.aac',
  amr = '.amr',
  flac = '.flac',
  m4a = '.m4a',
  ts = '.ts',
  mp3 = '.mp3',
  ogg = '.ogg',
  wav = '.wav',
  '3gp' = '.3gp',
  mp4 = '.mp4',
  mkv = '.mkv',
  webm = '.webm',
  bmp = '.bmp',
  gif = '.gif',
  jpg = '.jpg',
  png = '.png',
  webp = '.webp',
  heic = '.heic',
  heif = '.heif',
}

export const FILE_EXTENSIONS_AUTHORIZED: Accept = {
  'audio/aac': [],
  'audio/amr': [],
  'audio/flac': [],
  'audio/mpeg': ['.mp3'],
  'audio/ogg': [],
  'audio/wav': [],
  'video/mp4': ['.m4a'],
  'video/mp2t': ['.ts'],
  'video/wav': [],
  'video/3gpp': ['.3gp'],
  'video/x-matroska': ['.mkv'],
  'video/webm': [],
  'image/bmp': [],
  'image/gif': [],
  'image/jpeg': ['.jpg', '.jpeg'],
  'image/png': [],
  'image/webp': [],
  'image/heic': [],
  'image/heif': [],
}

export const DEFAULT_TABLE_PER_PAGE = 5
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
