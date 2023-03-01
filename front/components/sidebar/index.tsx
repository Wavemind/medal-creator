/**
 * The external imports
 */
import { useEffect, useMemo } from 'react'
import { useRouter } from 'next/router'
import { useTranslation } from 'next-i18next'
import { useTheme, VStack, Text } from '@chakra-ui/react'
import Image from 'next/image'

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
// import { useDeleteSessionMutation } from '@/lib/services/modules/session'
import { useGetProjectQuery } from '@/lib/services/modules/project'
import projectPlaceholder from '@/public/project-placeholder.svg'

const Sidebar = () => {
  const { colors, dimensions } = useTheme()
  const { t } = useTranslation('common')
  const router = useRouter()
  const { projectId } = router.query

  // const [signOut, signOutValues] = useDeleteSessionMutation()
  const { data: project } = useGetProjectQuery(Number(projectId))

  const sidebarItems = useMemo(
    () => [
      {
        key: 'algorithms',
        icon: (props: any) => <AlgorithmsIcon boxSize={8} {...props} />,
      },
      {
        key: 'library',
        icon: (props: any) => <LibraryIcon boxSize={8} {...props} />,
      },
      {
        key: 'recent',
        icon: (props: any) => <RecentIcon boxSize={8} {...props} />,
      },
    ],
    []
  )

  const handleSignOut = () => false

  // useEffect(() => {
  //   if (signOutValues.isSuccess) {
  //     router.push('/auth/sign-in')
  //   }
  // }, [signOutValues])

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
            label={t(item.key)}
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
