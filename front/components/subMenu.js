/**
 * The external imports
 */
import { VStack, Button, useTheme } from '@chakra-ui/react'
import { useRouter } from 'next/router'
import { useTranslation } from 'next-i18next'

/**
 * The internal imports
 */
import { menuOptions } from '/lib/config/subMenuOptions'

const SubMenu = ({ menuType }) => {
  const { t } = useTranslation('submenu')
  const router = useRouter()
  const { colors, dimensions } = useTheme()

  return (
    <VStack
      spacing={20}
      justifyContent="flex-start"
      alignItems="flex-start"
      bg={colors.subMenu}
      paddingBottom={20}
      paddingTop={10}
      paddingLeft={7}
      paddingRight={7}
      overflowY="visible"
      overflowX="hidden"
      position="fixed"
      left={dimensions.sidebarWidth}
      top={dimensions.headerHeight}
      width={dimensions.subMenuWidth}
      height={`calc(100vh - ${dimensions.headerHeight})`}
      boxShadow="-5px 1px 4px 2px rgba(163,163,163,0.85);"
    >
      {menuOptions[menuType].map(option => (
        <Button
          variant={router.pathname === `/account/${option}` ? 'solid' : 'ghost'}
          width='full'
          justifyContent='flex-start'
          onClick={() => router.push(`/account/${option}`)}
        >
          {t(`account.${option}`)}
        </Button>
      ))}
    </VStack>
  )
}

export default SubMenu