/**
 * The external imports
 */
import { useEffect } from 'react'
import { Flex, VStack, IconButton, Tooltip } from '@chakra-ui/react'
import { useTranslation } from 'next-i18next'
import Image from 'next/image'
import { Link } from '@chakra-ui/next-js'
import { signOut } from 'next-auth/react'

/**
 * The internal imports
 */
import { validationTranslations } from '@/lib/utils/validationTranslations'
import Logo from '@/public/logo.svg'
import AlgorithmsIcon from '@/assets/icons/Algorithms'
import FaqIcon from '@/assets/icons/Faq'
import LibraryIcon from '@/assets/icons/Library'
import LogoutIcon from '@/assets/icons/Logout'
import RecentIcon from '@/assets/icons/Recent'
import UserMenu from '@/components/userMenu'
import { useAppRouter } from '@/lib/hooks'
import DrawerProvider from '@/lib/providers/drawer'
import ModalProvider from '@/lib/providers/modal'
import PublishIcon from '@/assets/icons/Publish'
import ProjectProvider from '@/lib/providers/project'
import type { DiagramLayoutComponent } from '@/types'

const DiagramLayout: DiagramLayoutComponent = ({ children }) => {
  const { t } = useTranslation('validations')
  const router = useAppRouter()
  const { projectId } = router.query

  useEffect(() => {
    validationTranslations(t)
  }, [t])

  /**
   * Logout user
   */
  const handleSignOut = (): void => {
    signOut({ callbackUrl: '/auth/sign-in' })
  }

  return (
    <Flex justifyContent='flex-start'>
      <VStack bg='primary' justifyContent='space-between' py={2}>
        <VStack spacing={8}>
          <Tooltip
            label={t('projects', { ns: 'common' })}
            hasArrow
            placement='right'
          >
            <Link href='/' position='relative'>
              <Image
                src={Logo}
                alt='logo'
                width={60}
                priority
                placeholder='blur'
                blurDataURL='@/public/logo.svg'
              />
            </Link>
          </Tooltip>
          <Tooltip
            label={t('algorithms', { ns: 'common' })}
            hasArrow
            placement='right'
          >
            <IconButton
              aria-label={t('algorithms', { ns: 'common' })}
              as={Link}
              href={`/projects/${projectId}/algorithms`}
              size='lg'
              icon={<AlgorithmsIcon boxSize={7} />}
            />
          </Tooltip>
          <Tooltip
            label={t('library', { ns: 'common' })}
            hasArrow
            placement='right'
          >
            <IconButton
              aria-label={t('library', { ns: 'common' })}
              as={Link}
              href={`/projects/${projectId}/library`}
              size='lg'
              icon={<LibraryIcon boxSize={6} />}
            />
          </Tooltip>
          <Tooltip
            label={t('publication', { ns: 'common' })}
            hasArrow
            placement='right'
          >
            <IconButton
              aria-label={t('publication', { ns: 'common' })}
              as={Link}
              href={`/projects/${projectId}/publication`}
              size='lg'
              icon={<PublishIcon boxSize={6} />}
            />
          </Tooltip>
          <Tooltip
            label={t('recent', { ns: 'common' })}
            hasArrow
            placement='right'
          >
            <IconButton
              aria-label={t('recent', { ns: 'common' })}
              size='lg'
              icon={<RecentIcon boxSize={6} />}
            />
          </Tooltip>
        </VStack>
        <VStack spacing={8}>
          <UserMenu short={true} />
          <Tooltip
            label={t('faq', { ns: 'common' })}
            hasArrow
            placement='right'
          >
            <IconButton
              aria-label={t('faq', { ns: 'common' })}
              size='lg'
              icon={<FaqIcon boxSize={6} />}
            />
          </Tooltip>
          <Tooltip
            label={t('logout', { ns: 'common' })}
            hasArrow
            placement='right'
          >
            <IconButton
              aria-label={t('logout', { ns: 'common' })}
              onClick={handleSignOut}
              size='lg'
              icon={<LogoutIcon boxSize={6} />}
            />
          </Tooltip>
        </VStack>
      </VStack>
      <ProjectProvider>
        <ModalProvider>
          <DrawerProvider>{children}</DrawerProvider>
        </ModalProvider>
      </ProjectProvider>
    </Flex>
  )
}

export default DiagramLayout
