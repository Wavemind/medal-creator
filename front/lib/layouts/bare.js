/**
 * The external imports
 */
import { Flex, useTheme, Box, HStack, Select } from '@chakra-ui/react'
import Image from 'next/future/image'
import { useRouter } from 'next/router'

/**
 * The internal imports
 */
import { UserMenu, SubMenu, AlertDialog, OptimizedLink } from '/components'
import { AlertDialogContext } from '../contexts'
import useAlertDialog from '../hooks/useAlertDialog'
import Logo from '/public/logo.svg'

const BareLayout = ({ children, menuType = null }) => {
  const { colors, dimensions } = useTheme()
  const router = useRouter()

  const {
    isOpenAlertDialog,
    openAlertDialog,
    closeAlertDialog,
    alertDialogContent,
  } = useAlertDialog()

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
        {menuType && <SubMenu menuType={menuType} forceRight={true} />}
        <Box
          position='fixed'
          left={menuType ? dimensions.subMenuWidth : 0}
          top={dimensions.headerHeight}
          padding={10}
          height={`calc(100% - ${dimensions.headerHeight})`}
          width={menuType ? `calc(100% - ${dimensions.subMenuWidth})` : '100%'}
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
