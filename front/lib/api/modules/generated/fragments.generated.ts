import * as Types from '../../../../types/graphql.d'

export type HstoreLanguagesFragment = {
  __typename?: 'Hstore'
  en?: string | null
  fr?: string | null
}

export type MediaFieldsFragment = {
  __typename?: 'File'
  id: string
  name: string
  size: number
  url: string
  extension: string
}

export const HstoreLanguagesFragmentDoc = `
    fragment HstoreLanguages on Hstore {
  en
  fr
}
    `
export const MediaFieldsFragmentDoc = `
    fragment MediaFields on File {
  id
  name
  size
  url
  extension
}
    `
