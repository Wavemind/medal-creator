/**
 * The internal imports
 */
import { extractTranslation } from '.'
import type { NodeEdge, Option } from '@/types'

export const transformPaginationToOptions = (
  edges: Array<Omit<NodeEdge, 'id' | 'cursor'>>,
  language = 'en'
): Option[] => {
  return edges.map(edge => ({
    value: edge.node.id,
    label: extractTranslation(edge.node.labelTranslations, language),
  }))
}
