/**
 * The external imports
 */
import { useEffect } from 'react'
import {
  Flex,
  VStack,
  IconButton,
  Tooltip,
  Menu,
  MenuButton,
  MenuList,
  MenuItem,
} from '@chakra-ui/react'
import { useTranslation } from 'next-i18next'
import Image from 'next/image'
import { Link } from '@chakra-ui/next-js'
import { signOut } from 'next-auth/react'

/**
 * The internal imports
 */
import { validationTranslations } from '@/lib/utils'
import Logo from '@/public/logo.svg'
import {
  AlgorithmsIcon,
  FaqIcon,
  LibraryIcon,
  LogoutIcon,
  RecentIcon,
} from '@/assets/icons'
import { UserMenu } from '@/components'
import { useAppRouter } from '@/lib/hooks'
import { ModalProvider } from '@/lib/providers'
import type { DiagramLayoutComponent } from '@/types'

const DiagramLayout: DiagramLayoutComponent = ({ children }) => {
  const { t } = useTranslation('validations')
  const router = useAppRouter()
  const { projectId } = router.query

  useEffect(() => {
    validationTranslations(t)
  }, [t])

  /**
   * Changes the selected language
   * @param {*} e event object
   */
  const handleLanguageSelect = (locale: string) => {
    const { pathname, asPath, query } = router
    router.push({ pathname, query }, asPath, {
      locale,
    })
  }

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
          <Menu>
            <MenuButton
              borderRadius='50px'
              color='white'
              p={3}
              _hover={{ bg: 'blue.700' }}
              _expanded={{ bg: 'white', color: 'primary' }}
            >
              {router.locale === 'en' ? 'EN' : 'FR'}
            </MenuButton>
            <MenuList>
              <MenuItem onClick={() => handleLanguageSelect('en')}>EN</MenuItem>
              <MenuItem onClick={() => handleLanguageSelect('fr')}>FR</MenuItem>
            </MenuList>
          </Menu>
          <UserMenu />
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
      <ModalProvider>{children}</ModalProvider>
    </Flex>
  )
}

export default DiagramLayout
