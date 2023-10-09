/**
 * The external imports
 */
import { useContext } from 'react'

/**
 * The internal imports
 */
import { DrawerContext } from '@/lib/contexts'
import type { OverlayHook, Drawer } from '@/types'

export const useDrawer = () => {
  const context = useContext(DrawerContext) as OverlayHook<Drawer>

  if (!context) {
    throw new Error('useDrawer must be used within DrawerProvider')
  }
  return context
}
