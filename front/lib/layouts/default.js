/**
 * The external imports
 */
import { Flex, Image, useTheme, Box } from '@chakra-ui/react'

/**
 * The internal imports
 */
import { Sidebar, UserMenu, SubMenu, AlertDialog } from '/components'
import { AlertDialogContext } from '../contexts'
import useAlertDialogModal from '../hooks/useAlertDialogModal'

const Layout = ({ children, menuType = null }) => {
  const { colors, dimensions } = useTheme()

  const {
    isOpenAlertDialog,
    openAlertDialog,
    closeAlertDialog,
    alertDialogContent,
  } = useAlertDialogModal()

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
      >
        <Image src={'/logo.svg'} alt='logo' height={14} />
        <UserMenu />
      </Flex>
      <Flex>
        <Sidebar />
        {menuType && <SubMenu menuType={menuType} />}
        <Box
          position='fixed'
          left={
            menuType
              ? `calc(${dimensions.sidebarWidth} + ${dimensions.subMenuWidth})`
              : dimensions.sidebarWidth
          }
          top={dimensions.headerHeight}
          padding={10}
          height={`calc(100% - ${dimensions.headerHeight})`}
          width={
            menuType
              ? `calc(100% - ${dimensions.sidebarWidth} - ${dimensions.subMenuWidth})`
              : `calc(100% - ${dimensions.sidebarWidth})`
          }
          overflowY='visible'
          overflowX='hidden'
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
          </AlertDialogContext.Provider>
        </Box>
      </Flex>
    </Box>
  )
}

export default Layout
