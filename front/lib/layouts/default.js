/**
 * The external imports
 */
import { Flex, Image, useTheme, Box } from '@chakra-ui/react'

/**
 * The internal imports
 */
import { Sidebar, UserMenu, SubMenu } from '../../components'

const Layout = ({ children, menuType = null }) => {
  const { colors, dimensions } = useTheme()

  return (
    <Box width="100%">
      <Flex
        bg={colors.primary}
        height={dimensions.headerHeight}
        width="100%"
        alignItems="center"
        justifyContent="space-between"
        paddingRight={5}
        paddingLeft={5}
        position="fixed"
        zIndex={9999}
      >
        <Image src={'/logo.svg'} alt="logo" height={14} />
        <UserMenu />
      </Flex>
      <Flex>
        <Sidebar />
        {menuType && <SubMenu menuType={menuType} />}
        <Box
          position="fixed"
          left={
            menuType ?
              `calc(${dimensions.sidebarWidth} + ${dimensions.subMenuWidth})` :
              dimensions.sidebarWidth
          }
          top={dimensions.headerHeight}
          padding={10}
          height={`calc(100% - ${dimensions.headerHeight})`}
          width={
            menuType ?
              `calc(100% - ${dimensions.sidebarWidth} - ${dimensions.subMenuWidth})` :
              `calc(100% - ${dimensions.sidebarWidth})`
          }
          overflowY="visible"
          overflowX="hidden"
        >
          {children}
        </Box>
      </Flex>
    </Box>
  )
}

export default Layout
