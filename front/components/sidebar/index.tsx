/**
 * The external imports
 */
import { FC, useMemo } from 'react'
import { useTranslation } from 'next-i18next'
import { useTheme, VStack, Text } from '@chakra-ui/react'
import Image from 'next/image'
import { signOut, useSession } from 'next-auth/react'

/**
 * The internal imports
 */
import LogoutIcon from '@/assets/icons/Logout'
import FaqIcon from '@/assets/icons/Faq'
import AlgorithmsIcon from '@/assets/icons/Algorithms'
import LibraryIcon from '@/assets/icons/Library'
import RecentIcon from '@/assets/icons/Recent'
import SidebarButton from '@/components/sidebar/sidebarButton'
import projectPlaceholder from '@/public/project-placeholder.svg'
import { useAppRouter, useProject } from '@/lib/hooks'
import PublishIcon from '@/assets/icons/Publish'
import { RoleEnum } from '@/types'

const Sidebar: FC = () => {
  const { colors, dimensions } = useTheme()
  const { t } = useTranslation('common')
  const { name, isAdminOrClinician, isCurrentUserAdmin } = useProject()
  const { data: session } = useSession()
  const {
    pathname,
    query: { projectId },
  } = useAppRouter()

  // TODO : Improve this and remove disabled props
  const sidebarItems = useMemo(
    () => [
      {
        key: 'algorithms',
        isDisabled: false,
        icon: (props: JSX.IntrinsicAttributes) => (
          <AlgorithmsIcon boxSize={8} {...props} />
        ),
        isVisible: true,
      },
      {
        key: 'library',
        isDisabled: false,
        icon: (props: JSX.IntrinsicAttributes) => (
          <LibraryIcon boxSize={8} {...props} />
        ),
        isVisible: true,
      },
      {
        key: 'publication',
        isDisabled: false,
        icon: (props: JSX.IntrinsicAttributes) => (
          <PublishIcon boxSize={8} {...props} />
        ),
        isVisible:
          isCurrentUserAdmin ||
          (session &&
            [RoleEnum.Admin, RoleEnum.DeploymentManager].includes(
              session?.user.role
            )),
      },
      {
        key: 'recent',
        isDisabled: true,
        icon: (props: JSX.IntrinsicAttributes) => (
          <RecentIcon boxSize={8} {...props} />
        ),
        isVisible: true,
      },
    ],
    [isAdminOrClinician, session]
  )

  /**
   * Logout user
   */
  const handleSignOut = (): void => {
    signOut({ callbackUrl: '/auth/sign-in' })
  }

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
      <VStack spacing={4}>
        {name && (
          <SidebarButton
            data-testid='sidebar-project'
            icon={props => (
              <Image src={projectPlaceholder} alt='logo' {...props} />
            )}
            label={name}
            isDisabled={false}
            href={`/projects/${projectId}`}
            active={pathname === '/projects/'}
          />
        )}
        {sidebarItems
          .filter(item => item.isVisible)
          .map(item => (
            <SidebarButton
              data-testid={`sidebar-${item.key}`}
              key={`sidebar_${item.key}`}
              icon={item.icon}
              isDisabled={item.isDisabled}
              label={t(item.key, { defaultValue: '' })}
              href={`/projects/${projectId}/${item.key}`}
              active={pathname.includes(`/projects/[projectId]/${item.key}`)}
            />
          ))}
      </VStack>
      <VStack width={118} spacing={4}>
        <SidebarButton
          icon={props => <FaqIcon boxSize={8} {...props} />}
          label={t('faq')}
          href='/faq'
          isDisabled={true}
          active={pathname.startsWith('/faq')}
        />
        <VStack
          width={dimensions.sidebarWidth}
          onClick={handleSignOut}
          paddingTop={2}
          paddingBottom={2}
          justifyContent='center'
          cursor='pointer'
          _hover={{
            backgroundColor: colors.subMenu,
            textDecoration: 'none',
          }}
        >
          <LogoutIcon boxSize={8} />
          <Text
            fontSize={10}
            color={colors.primary}
            fontWeight='normal'
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
