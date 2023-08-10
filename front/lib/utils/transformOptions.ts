/**
 * The internal imports
 */
import { extractTranslation } from './string'
import type { GetComplaintCategories } from '../api/modules'
import type { Option } from '@/types'

// TODO : Check if we can generalize this to use in ExcludedDrug
export const transformPaginationToOptions = (
  edges: GetComplaintCategories['edges'],
  language = 'en'
): Option[] => {
  return edges.map(edge => ({
    value: edge.node.id,
    label: extractTranslation(edge.node.labelTranslations, language),
  }))
}
