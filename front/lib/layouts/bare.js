/**
 * The external imports
 */
import { Flex, useTheme, Box } from '@chakra-ui/react'
import Image from 'next/future/image'

/**
 * The internal imports
 */
import { UserMenu, SubMenu, AlertDialog, OptimizedLink } from '/components'
import { AlertDialogContext } from '../contexts'
import useAlertDialog from '../hooks/useAlertDialog'
import Logo from '/public/logo.svg'

const BareLayout = ({ children, menuType = null }) => {
  const { colors, dimensions } = useTheme()

  const {
    isOpenAlertDialog,
    openAlertDialog,
    closeAlertDialog,
    alertDialogContent,
  } = useAlertDialog()

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
        <UserMenu />
      </Flex>
      <Flex>
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

export default BareLayout
