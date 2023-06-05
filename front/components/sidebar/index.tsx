/**
 * The external imports
 */
import { FC, useMemo } from 'react'
import { useRouter } from 'next/router'
import { useTranslation } from 'next-i18next'
import { useTheme, VStack, Text } from '@chakra-ui/react'
import Image from 'next/image'
import { signOut } from 'next-auth/react'

/**
 * The internal imports
 */
import {
  LogoutIcon,
  FaqIcon,
  AlgorithmsIcon,
  LibraryIcon,
  RecentIcon,
} from '@/assets/icons'
import { SidebarButton } from '@/components'
import { useGetProjectQuery } from '@/lib/api/modules'
import projectPlaceholder from '@/public/project-placeholder.svg'

const Sidebar: FC = () => {
  const { colors, dimensions } = useTheme()
  const { t } = useTranslation('common')
  const router = useRouter()
  const { projectId } = router.query

  // TODO : Find a better way
  const { data: project } = useGetProjectQuery({ id: projectId as string })

  const sidebarItems = useMemo(
    () => [
      {
        key: 'algorithms',
        icon: (props: JSX.IntrinsicAttributes) => (
          <AlgorithmsIcon boxSize={8} {...props} />
        ),
      },
      {
        key: 'library',
        icon: (props: JSX.IntrinsicAttributes) => (
          <LibraryIcon boxSize={8} {...props} />
        ),
      },
      {
        key: 'recent',
        icon: (props: JSX.IntrinsicAttributes) => (
          <RecentIcon boxSize={8} {...props} />
        ),
      },
    ],
    []
  )

  const handleSignOut = () => {
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
      <VStack spacing={10}>
        {project && (
          <SidebarButton
            data-cy='sidebar_project'
            icon={props => (
              <Image src={projectPlaceholder} alt='logo' {...props} />
            )}
            label={project.name}
            href={`/projects/${project.id}`}
            active={router.pathname === '/projects/'}
          />
        )}
        {sidebarItems.map(item => (
          <SidebarButton
            data-cy={`sidebar_${item.key}`}
            key={`sidebar_${item.key}`}
            icon={item.icon}
            label={t(item.key, { defaultValue: '' })}
            href={`/projects/${project?.id}/${item.key}`}
            active={router.pathname.includes(
              `/projects/[projectId]/${item.key}`
            )}
          />
        ))}
      </VStack>
      <VStack width={118} spacing={10}>
        <SidebarButton
          icon={props => <FaqIcon boxSize={8} {...props} />}
          label={t('faq')}
          href='/faq'
          active={router.pathname.startsWith('/faq')}
        />
        <VStack
          width={dimensions.sidebarWidth}
          onClick={handleSignOut}
          paddingTop={2}
          paddingBottom={2}
          justifyContent='center'
          cursor='pointer'
          _hover={{
            backgroundColor: colors.sidebarHover,
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
