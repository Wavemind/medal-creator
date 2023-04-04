/**
 * The external imports
 */
import type { DropOptions, NodeModel } from '@minoru/react-dnd-treeview'

/**
 * The internal imports
 */
import type { LabelTranslations } from './common'

export type TreeNodeModel = NodeModel<LabelTranslations>
export type TreeNodeOptions = DropOptions<LabelTranslations>
