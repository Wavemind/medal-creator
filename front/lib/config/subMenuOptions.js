export const MENU_OPTIONS = {
  account: {
    links: [
      { label: 'account.information', path: '/account/information' },
      { label: 'account.credentials', path: '/account/credentials' },
      { label: 'account.projects', path: '/account/projects' },
    ],
  },
  algorithm: {
    links: [
      {
        label: 'algorithms.decision_tree',
        path: '/projects/[projectId]/algorithms/[algorithmId]',
      },
      {
        label: 'algorithms.order',
        path: '/projects/[projectId]/algorithms/[algorithmId]/order',
      },
      {
        label: 'algorithms.config',
        path: '/projects/[projectId]/algorithms/[algorithmId]/config',
      },
      {
        label: 'algorithms.translations',
        path: '/projects/[projectId]/algorithms/[algorithmId]/translations',
      },
    ],
  },
}
