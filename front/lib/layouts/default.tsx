/**
 * The external imports
 */
import { useEffect, useMemo, useRef } from 'react'
import { Flex, useTheme, Box } from '@chakra-ui/react'
import Image from 'next/image'
import { signOut } from 'next-auth/react'
import { useTranslation } from 'next-i18next'
import { Link } from '@chakra-ui/next-js'

/**
 * The internal imports
 */
import Sidebar from '@/components/sidebar'
import UserMenu from '@/components/userMenu'
import SubMenu from '@/components/sidebar/subMenu'
import { TIMEOUT_INACTIVITY } from '@/lib/config/constants'
import { validationTranslations } from '@/lib/utils/validationTranslations'
import ProjectProvider from '@/lib/providers/project'
import WebSocketProvider from '@/lib/providers/webSocket'
import ModalProvider from '@/lib/providers/modal'
import AlertDialogProvider from '@/lib/providers/alertDialog'
import DrawerProvider from '@/lib/providers/drawer'
import Logo from '@/public/logo.svg'
import type { DefaultLayoutComponent } from '@/types'

const Layout: DefaultLayoutComponent = ({
  children,
  menuType = null,
  showSideBar = true,
}) => {
  const { t } = useTranslation('validations')
  validationTranslations(t)

  const { colors, dimensions } = useTheme()
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
          <Image src={Logo} alt='logo' priority height={80} />
        </Link>
        <UserMenu />
      </Flex>
      <Flex>
        <ProjectProvider>
          <DrawerProvider>
            <WebSocketProvider>
              <ModalProvider>
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
                  <AlertDialogProvider>{children}</AlertDialogProvider>
                </Box>
              </ModalProvider>
            </WebSocketProvider>
          </DrawerProvider>
        </ProjectProvider>
      </Flex>
    </Box>
  )
}

export default Layout
