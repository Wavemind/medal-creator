/**
 * The external imports
 */
import { VStack, useTheme, Flex, Heading, Divider } from '@chakra-ui/react'
import { useTranslation } from 'next-i18next'
import { useRouter } from 'next/router'
import React from 'react'

/**
 * The internal imports
 */
import { OptimizedLink } from '/components/'
import { MENU_OPTIONS } from '/lib/config/subMenuOptions'
import { useGetAlgorithmQuery } from '/lib/services/modules/algorithm'

const SubMenu = ({ menuType }) => {
  const { t } = useTranslation('submenu')
  const { colors, dimensions } = useTheme()
  const router = useRouter()
  const { algorithmId } = router.query

  const { data: algorithm } = useGetAlgorithmQuery(algorithmId, {
    skip: !algorithmId,
  })

  return (
    <Flex
      left={menuType === 'account' ? 0 : dimensions.sidebarWidth}
      top={dimensions.headerHeight}
      bg={colors.subMenu}
      width={dimensions.subMenuWidth}
      position='fixed'
      height={`calc(100vh - ${dimensions.headerHeight})`}
      boxShadow='-4px 0px 8px rgba(0, 0, 0, 0.25)'
    >
      <VStack
        spacing={12}
        alignItems='flex-start'
        paddingBottom={20}
        paddingTop={10}
        paddingLeft={7}
        paddingRight={7}
        overflowY='visible'
        overflowX='hidden'
        w='full'
      >
        {algorithm && (
          <React.Fragment>
            <VStack justifyContent='center' w='full' spacing={4}>
              <Heading variant='h3'>{algorithm.name}</Heading>
              <Heading variant='h4'>
                {t(`enum.mode.${algorithm.mode}`, { ns: 'algorithms' })}
              </Heading>
            </VStack>
            <Divider />
          </React.Fragment>
        )}
        {MENU_OPTIONS[menuType].map(link => (
          <OptimizedLink
            key={link.path}
            href={link.path}
            data-cy={`subMenu_${link.label}`}
            variant={
              router.pathname === link.path ? 'activeSubMenu' : 'subMenu'
            }
          >
            {t(link.label)}
          </OptimizedLink>
        ))}
      </VStack>
    </Flex>
  )
}

export default SubMenu
