import * as Types from '../../../../types/graphql.d';

export type HstoreLanguagesFragment = { en?: string | null, fr?: string | null };

export type MediaFieldsFragment = { id: string, name: string, size: number, url: string, extension: string };

export type ExcludedNodesFragment = { id: string, labelTranslations: { en?: string | null, fr?: string | null } };

export const MediaFieldsFragmentDoc = `
    fragment MediaFields on File {
  id
  name
  size
  url
  extension
}
    `;
export const HstoreLanguagesFragmentDoc = `
    fragment HstoreLanguages on Hstore {
  en
  fr
}
    `;
export const ExcludedNodesFragmentDoc = `
    fragment ExcludedNodes on Node {
  id
  labelTranslations {
    ...HstoreLanguages
  }
}
    ${HstoreLanguagesFragmentDoc}`;
