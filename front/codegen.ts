import type { CodegenConfig } from '@graphql-codegen/cli'

const config: CodegenConfig = {
  overwrite: true,
  schema: '../api/schema.graphql',
  documents: 'lib/api/modules/documents/*.graphql',
  generates: {
    'types/graphql.d.ts': {
      plugins: ['typescript'],
      config: {
        skipTypename: true,
      },
    },
    '': {
      preset: 'near-operation-file',
      presetConfig: {
        baseTypesPath: 'types/graphql.d.ts',
        folder: '../generated',
      },
      config: {
        skipTypename: true,
      },
      plugins: [
        {
          'typescript-operations': {
            skipTypeNameForRoot: true,
          },
        },
        {
          'typescript-rtk-query': {
            importBaseApiFrom: '@/lib/api/apiGraphql',
            importBaseApiAlternateName: 'apiGraphql',
            exportHooks: false,
          },
        },
      ],
    },
  },
}

export default config
