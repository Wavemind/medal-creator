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
import type { FC } from 'react'

/**
 * The internal imports
 */
import { DrawerContext } from '@/lib/contexts'

const Drawer: FC = () => {
  const {
    isDrawerOpen,
    closeDrawer,
    drawerContent: { title, content },
  } = useContext(DrawerContext)

  return (
    <ChakraDrawer
      variant='permanent'
      isOpen={isDrawerOpen}
      placement='right'
      onClose={closeDrawer}
      trapFocus={false}
    >
      <DrawerContent zIndex={0}>
        <DrawerCloseButton />
        <DrawerHeader>{title}</DrawerHeader>

        <DrawerBody>
          {content}
        </DrawerBody>

        <DrawerFooter>
          <Button variant='outline' mr={3} onClick={closeDrawer}>
            Cancel
          </Button>
          <Button colorScheme='blue'>Save</Button>
        </DrawerFooter>
      </DrawerContent>
    </ChakraDrawer>
  )
}

export default Drawer
