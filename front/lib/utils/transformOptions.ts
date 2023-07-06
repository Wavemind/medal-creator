/**
 * The internal imports
 */
import { extractTranslation } from '.'
import type { GetComplaintCategories } from '../api/modules'
import type { Option } from '@/types'

export const transformPaginationToOptions = (
  edges: GetComplaintCategories['edges'],
  language = 'en'
): Option[] => {
  return edges.map(edge => ({
    value: edge.node.id,
    label: extractTranslation(edge.node.labelTranslations, language),
  }))
}
