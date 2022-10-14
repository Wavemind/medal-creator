/**
 * The external imports
 */
import { useEffect, useMemo } from 'react'
import { useRouter } from 'next/router'
import { useTranslation } from 'next-i18next'
import { Image, useTheme, VStack, Text } from '@chakra-ui/react'

/**
 * The internal imports
 */
import {
  LogoutIcon,
  FaqIcon,
  AlgorithmsIcon,
  LibraryIcon,
  RecentIcon,
} from '/assets/icons'
import { SidebarButton } from '/components'
import { useDeleteSessionMutation } from '/lib/services/modules/session'

const Sidebar = () => {
  const { colors, dimensions } = useTheme()
  const router = useRouter()
  const { t } = useTranslation('common')
  const [signOut, signOutValues] = useDeleteSessionMutation()

  const sidebarItems = useMemo(
    () => [
      {
        key: 'algorithms',
        icon: props => <AlgorithmsIcon boxSize={10} {...props} />,
      },
      {
        key: 'library',
        icon: props => <LibraryIcon boxSize={10} {...props} />,
      },
      { key: 'recent', icon: props => <RecentIcon boxSize={6} {...props} /> },
    ],
    []
  )

  useEffect(() => {
    if (signOutValues.isSuccess) {
      router.push('/auth/sign-in')
    }
  }, [signOutValues])

  return (
    <VStack
      justifyContent='space-between'
      bg={colors.sidebar}
      paddingBottom={20}
      paddingTop={5}
      height={`calc(100vh - ${dimensions.headerHeight})`}
      overflowY='visible'
      overflowX='hidden'
      position='fixed'
      top={dimensions.headerHeight}
      width={dimensions.sidebarWidth}
    >
      <VStack spacing={10}>
        <SidebarButton
          data-cy='sidebar_project'
          // TODO Get a better dynamic icon cos I can't change the color of this one
          icon={props => (
            <Image src={'/logoDynamic.svg'} alt='logo' height={12} {...props} />
          )}
          // TODO get this from the algo I'm guessing ?
          // TODO get the name of the project dynamically and interpolate
          label='Dynamic Tanzania'
          href={`/projects/${encodeURIComponent('ePOCT+ Dynamic Tanzania')}`}
          active={router.pathname.startsWith('/projects/')}
        />
        {sidebarItems.map(item => (
          <SidebarButton
            data-cy={`sidebar_${item.key}`}
            key={`sidebar_${item.key}`}
            icon={item.icon}
            label={t(item.key)}
            href={`/${item.key}`}
            active={router.pathname.startsWith(`/${item.key}`)}
          />
        ))}
      </VStack>
      <VStack width={118} spacing={10}>
        <SidebarButton
          icon={props => <FaqIcon boxSize={6} {...props} />}
          label={t('faq')}
          href='/faq'
          active={router.pathname.startsWith('/faq')}
        />
        <VStack
          width={dimensions.sidebarWidth}
          onClick={signOut}
          paddingTop={2}
          paddingBottom={2}
          justifyContent='center'
          cursor='pointer'
          _hover={{
            backgroundColor: colors.sidebarHover,
            textDecoration: 'none',
          }}
        >
          <LogoutIcon boxSize={6} />
          <Text
            fontSize='xs'
            color={colors.primary}
            fontWeight={'normal'}
            textAlign='center'
          >
            {t('logout')}
          </Text>
        </VStack>
      </VStack>
    </VStack>
  )
}

export default Sidebar
