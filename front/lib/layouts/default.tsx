/**
 * The external imports
 */
import { useEffect, useMemo, useRef } from 'react'
import {
  Flex,
  useTheme,
  Box,
  HStack,
  Menu,
  MenuButton,
  MenuList,
  MenuItem,
} from '@chakra-ui/react'
import Image from 'next/image'
import { useRouter } from 'next/router'
import { signOut } from 'next-auth/react'
import { ChevronDownIcon } from '@chakra-ui/icons'
import { Link } from '@chakra-ui/next-js'

/**
 * The internal imports
 */
import {
  Sidebar,
  UserMenu,
  SubMenu,
  AlertDialog,
  Modal,
  Drawer,
} from '@/components'
import { AlertDialogContext, ModalContext, DrawerContext } from '@/lib/contexts'
import { useModal, useAlertDialog, useDrawer } from '@/lib/hooks'
import { TIMEOUT_INACTIVITY } from '@/lib/config/constants'
import Logo from '@/public/logo.svg'
import type { DefaultLayoutComponent } from '@/types'

const Layout: DefaultLayoutComponent = ({
  children,
  menuType = null,
  showSideBar = true,
}) => {
  const { colors, dimensions } = useTheme()
  const router = useRouter()

  const lastActive = useRef<number>(Date.now())

  /**
   * Handle user action in page
   */
  useEffect(() => {
    // Set last activity if already exist
    if (localStorage.getItem('lastActive')) {
      lastActive.current = Number(localStorage.getItem('lastActive'))
    }

    document.addEventListener('mousedown', handleUserActivity)
    document.addEventListener('keydown', handleUserActivity)

    return () => {
      document.removeEventListener('mousedown', handleUserActivity)
      document.removeEventListener('keydown', handleUserActivity)
    }
  }, [])

  /**
   * Add timeout of 60 minutes after user's last activity
   */
  const handleUserActivity = () => {
    lastActive.current = Date.now()

    const timeoutId = setTimeout(() => {
      const elapsedTime = Date.now() - lastActive.current
      if (elapsedTime > TIMEOUT_INACTIVITY) {
        signOut({ callbackUrl: '/auth/sign-in?notifications=inactivity' })
      }
    }, TIMEOUT_INACTIVITY)

    return () => {
      clearTimeout(timeoutId)
    }
  }

  /**
   * Set user activity
   */
  useEffect(() => {
    localStorage.setItem('lastActive', String(lastActive))
  }, [lastActive])

  const leftDimension = useMemo(() => {
    let lDdimension = showSideBar ? dimensions.sidebarWidth : 0
    if (menuType !== null) {
      lDdimension = `calc(${dimensions.sidebarWidth} + ${dimensions.subMenuWidth})`
    }

    return lDdimension
  }, [menuType, showSideBar])

  const widthDimension = useMemo(() => {
    let wDimension = showSideBar
      ? `calc(100% - ${dimensions.sidebarWidth})`
      : '100%'
    if (menuType !== null) {
      wDimension = `calc(100% - ${dimensions.sidebarWidth} - ${dimensions.subMenuWidth})`
    }

    return wDimension
  }, [menuType, showSideBar])

  const {
    isOpenAlertDialog,
    openAlertDialog,
    closeAlertDialog,
    alertDialogContent,
  } = useAlertDialog()

  const { isModalOpen, openModal, closeModal, modalContent } = useModal()
  const { isDrawerOpen, openDrawer, closeDrawer, drawerContent } = useDrawer()

  /**
   * Changes the selected language
   * @param {*} e event object
   */
  const handleLanguageSelect = (locale: string) => {
    const { pathname, asPath, query } = router
    router.push({ pathname, query }, asPath, {
      locale,
    })
  }

  return (
    <Box width='100%'>
      <Flex
        bg={colors.primary}
        height={dimensions.headerHeight}
        width='100%'
        alignItems='center'
        justifyContent='space-between'
        paddingRight={5}
        paddingLeft={5}
        position='fixed'
        zIndex={14}
      >
        <Link href='/' position='relative'>
          <Image
            src={Logo}
            alt='logo'
            priority
            height={80}
            placeholder='blur'
            blurDataURL='@/public/logo.svg'
          />
        </Link>
        <HStack spacing={4}>
          <Menu>
            <MenuButton
              px={4}
              py={2}
              borderRadius='2xl'
              borderWidth={2}
              color='white'
              _hover={{ bg: 'white', color: 'black' }}
              _expanded={{ bg: 'white', color: 'black' }}
            >
              {router.locale === 'en' ? 'English' : 'Français'}
              <ChevronDownIcon />
            </MenuButton>
            <MenuList>
              <MenuItem onClick={() => handleLanguageSelect('en')}>
                English
              </MenuItem>
              <MenuItem onClick={() => handleLanguageSelect('fr')}>
                Français
              </MenuItem>
            </MenuList>
          </Menu>
          <UserMenu />
        </HStack>
      </Flex>
      <Flex>
        {showSideBar && <Sidebar />}
        {menuType && <SubMenu menuType={menuType} />}
        <Box
          position='fixed'
          left={leftDimension}
          top={dimensions.headerHeight}
          padding={10}
          height={`calc(100% - ${dimensions.headerHeight})`}
          width={widthDimension}
          overflowY='visible'
          overflowX='hidden'
        >
          <ModalContext.Provider
            value={{ isModalOpen, openModal, closeModal, modalContent }}
          >
            <AlertDialogContext.Provider
              value={{
                isOpenAlertDialog,
                openAlertDialog,
                closeAlertDialog,
                alertDialogContent,
              }}
            >
              <DrawerContext.Provider
                value={{ isDrawerOpen, openDrawer, closeDrawer, drawerContent }}
              >
                {children}
                <AlertDialog />
                <Modal />
                <Drawer />
              </DrawerContext.Provider>
            </AlertDialogContext.Provider>
          </ModalContext.Provider>
        </Box>
      </Flex>
    </Box>
  )
}

export default Layout
