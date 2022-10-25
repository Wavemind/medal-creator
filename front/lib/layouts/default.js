/**
 * The external imports
 */
import { Flex, useTheme, Box, Select, HStack } from '@chakra-ui/react'
import Image from 'next/future/image'
import { useRouter } from 'next/router'

/**
 * The internal imports
 */
import {
  Sidebar,
  UserMenu,
  SubMenu,
  AlertDialog,
  Modal,
  OptimizedLink,
} from '/components'
import { AlertDialogContext, ModalContext } from '../contexts'
import { useModal, useAlertDialog } from '../hooks/'
import Logo from '/public/logo.svg'
import { useMemo } from 'react'

const Layout = ({ children, menuType = null, showSideBar = true }) => {
  const { colors, dimensions } = useTheme()
  const router = useRouter()

  // TODO: Calculate dimension
  const leftDimension = useMemo(() => {
    let lDdimension = showSideBar ? dimensions.sidebarWidth : 0
    if (menuType !== null) {
      lDdimension = `calc(${dimensions.sidebarWidth} + ${dimensions.subMenuWidth})`
    }
    return lDdimension
  })

  const widthDimension = useMemo(() => {
    let wDimension = showSideBar
      ? `calc(100% - ${dimensions.sidebarWidth})`
      : '100%'
    if (menuType !== null) {
      wDimension = `calc(100% - ${dimensions.sidebarWidth} - ${dimensions.subMenuWidth})`
    }

    return wDimension
  })

  const {
    isOpenAlertDialog,
    openAlertDialog,
    closeAlertDialog,
    alertDialogContent,
  } = useAlertDialog()

  const { isModalOpen, openModal, closeModal, modalContent } = useModal()

  /**
   * Changes the selected language
   * @param {*} e event object
   */
  const handleLanguageSelect = e => {
    const { pathname, asPath, query } = router
    router.push({ pathname, query }, asPath, {
      locale: e.target.value.toLowerCase(),
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
        <OptimizedLink href='/'>
          <Image src={Logo} alt='logo' sizes='100vw' />
        </OptimizedLink>
        <HStack spacing={4}>
          <Select
            onChange={handleLanguageSelect}
            defaultValue={router.locale}
            color='white'
          >
            <option value='en' style={{ color: 'black' }}>
              English
            </option>
            <option value='fr' style={{ color: 'black' }}>
              Français
            </option>
          </Select>
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
              {children}
              <AlertDialog />
              <Modal />
            </AlertDialogContext.Provider>
          </ModalContext.Provider>
        </Box>
      </Flex>
    </Box>
  )
}

export default Layout
