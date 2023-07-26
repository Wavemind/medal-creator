/**
 * The external imports
 */
import { useContext } from 'react'
import {
  Drawer as ChakraDrawer,
  DrawerContent,
  DrawerCloseButton,
  DrawerHeader,
  DrawerBody,
  DrawerFooter,
  Button,
} from '@chakra-ui/react'
import { useTranslation } from 'next-i18next'
import type { FC } from 'react'

/**
 * The internal imports
 */
import { DrawerContext } from '@/lib/contexts'

const Drawer: FC = () => {
  const { t } = useTranslation('common')

  const {
    isOpen,
    close,
    content: { title, content },
  } = useContext(DrawerContext)

  return (
    <ChakraDrawer
      variant='permanent'
      isOpen={isOpen}
      placement='right'
      onClose={close}
      trapFocus={false}
    >
      <DrawerContent zIndex={0}>
        <DrawerCloseButton />
        <DrawerHeader>{title}</DrawerHeader>
        <DrawerBody>{content}</DrawerBody>
        <DrawerFooter>
          <Button colorScheme='blue' onClick={close}>
            {t('close')}
          </Button>
        </DrawerFooter>
      </DrawerContent>
    </ChakraDrawer>
  )
}

export default Drawer
