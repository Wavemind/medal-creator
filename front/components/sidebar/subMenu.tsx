/**
 * The external imports
 */
import React from 'react'
import { VStack, useTheme, Flex, Heading, Divider } from '@chakra-ui/react'
import { useTranslation } from 'next-i18next'
import { useRouter } from 'next/router'
import { Link } from '@chakra-ui/next-js'

/**
 * The internal imports
 */
import { MENU_OPTIONS } from '@/lib/config/constants'
import { useGetAlgorithmQuery } from '@/lib/api/modules'
import type { SubMenuComponent } from '@/types'
import { skipToken } from '@reduxjs/toolkit/dist/query'

const SubMenu: SubMenuComponent = ({ menuType }) => {
  const { t } = useTranslation('submenu')
  const { colors, dimensions } = useTheme()
  const router = useRouter()
  const { projectId, algorithmId } = router.query

  const { data: algorithm } = useGetAlgorithmQuery(
    algorithmId ? { id: algorithmId as string } : skipToken
  )

  return (
    <Flex
      left={menuType === 'account' ? 0 : dimensions.sidebarWidth}
      top={dimensions.headerHeight}
      bg={colors.subMenu}
      width={dimensions.subMenuWidth}
      position='fixed'
      height={`calc(100vh - ${dimensions.headerHeight})`}
      boxShadow='-4px 0px 8px rgba(45, 45, 45, 0.1)'
    >
      <VStack
        spacing={12}
        alignItems='flex-start'
        paddingBottom={20}
        paddingTop={10}
        paddingLeft={4}
        paddingRight={4}
        overflowY='visible'
        overflowX='hidden'
        w='full'
      >
        <>
          {algorithmId && algorithm && (
            <React.Fragment>
              <VStack justifyContent='center' w='full' spacing={4}>
                <Heading variant='h3' fontWeight='bold'>
                  {algorithm.name}
                </Heading>
                <Heading variant='h4'>
                  {t(`enum.mode.${algorithm.mode}`, {
                    ns: 'algorithms',
                    defaultValue: '',
                  })}
                </Heading>
              </VStack>
              <Divider w='90%' alignSelf='center' />
            </React.Fragment>
          )}
          {MENU_OPTIONS[menuType].map(link => (
            <Link
              key={link.key}
              fontSize='sm'
              href={link.path({ projectId, algorithmId })}
              data-cy={`subMenu_${link.key}`}
              variant={
                router.asPath === link.path({ projectId, algorithmId })
                  ? 'activeSubMenu'
                  : 'subMenu'
              }
            >
              {t(link.label, { defaultValue: '' })}
            </Link>
          ))}
        </>
      </VStack>
    </Flex>
  )
}

export default SubMenu
