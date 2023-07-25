/**
 * The external imports
 */
import type { FC } from 'react'

/**
 * The internal imports
 */
import type { MenuOptionsList } from './common'

export type SidebarButtonComponent = FC<{
  icon: FC
  label: string
  active: boolean
  href: string
}>

export type SubMenuComponent = FC<{
  menuType: MenuOptionsList
}>
