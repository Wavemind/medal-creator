/**
 * The external imports
 */
import { FC, PropsWithChildren } from 'react'

/**
 * The internal imports
 */
import { Drawer } from '@/components'
import { DrawerContext } from '@/lib/contexts'
import { useDrawer } from '@/lib/hooks'

const DrawerProvider: FC<PropsWithChildren> = ({ children }) => {
  const drawer = useDrawer()

  console.log('in here')

  return (
    <DrawerContext.Provider value={drawer}>
      {children}
      <Drawer />
    </DrawerContext.Provider>
  )
}

export default DrawerProvider
