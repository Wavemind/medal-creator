/**
 * The external imports
 */
import type { FC } from 'react'

export type SidebarButtonComponent = FC<{
  icon: FC
  label: string
  active: boolean
  href: string
}>

export type SubMenuComponent = FC<{
  menuType: string
}>
