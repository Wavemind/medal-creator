/**
 * The external imports
 */
import { FC, PropsWithChildren, useState } from 'react'

/**
 * The internal imports
 */
import { DrawerContext } from '@/lib/contexts'
import Drawer from '@/components/drawer'
import type { Drawer as DrawerType } from '@/types'

const DrawerProvider: FC<PropsWithChildren> = ({ children }) => {
  const [isOpen, setIsOpen] = useState(false)
  const [content, setContent] = useState<DrawerType>({
    title: '',
    content: null,
  })

  const open = ({ title, content }: DrawerType): void => {
    setIsOpen(true)
    if (content) {
      setContent({ title, content })
    }
  }

  const close = (): void => {
    setIsOpen(false)
  }

  return (
    <DrawerContext.Provider
      value={{
        isOpen,
        open,
        close,
        content,
      }}
    >
      {children}
      <Drawer />
    </DrawerContext.Provider>
  )
}

export default DrawerProvider
