/**
 * The external imports
 */
import React, { useMemo } from 'react'
import { useTranslation } from 'next-i18next'
import {
  Menu,
  MenuButton,
  MenuList,
  MenuItem,
  MenuDivider,
  Button,
  Skeleton,
  Tooltip,
  MenuGroup,
} from '@chakra-ui/react'
import Link from 'next/link'
import { signOut, useSession } from 'next-auth/react'

/**
 * The internal imports
 */
import { ChevronDownIcon } from '@chakra-ui/icons'
import WarningIcon from '@/assets/icons/Warning'
import UserIcon from '@/assets/icons/User'
import { useAppRouter } from '@/lib/hooks/useAppRouter'
import type { UserMenuComponent } from '@/types'

const UserMenu: UserMenuComponent = ({ short = false }) => {
  const { t } = useTranslation('common')
  const router = useAppRouter()

  const { data: session, status } = useSession()

  const handleSignOut = () => signOut({ callbackUrl: '/auth/sign-in' })

  const isOtpActivated = useMemo(() => {
    if (session) {
      return session?.user.otp_required_for_login
    }
    return false
  }, [session])

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

  return (
    <Menu variant='outline'>
      <Skeleton isLoaded={status === 'authenticated'} borderRadius='xl'>
        <Tooltip
          label={t('header.turnOnOTP')}
          hasArrow
          isDisabled={isOtpActivated}
        >
          <MenuButton
            minW={short ? 0 : 6}
            as={Button}
            data-testid='user-menu'
            rightIcon={short ? <React.Fragment /> : <ChevronDownIcon />}
            leftIcon={
              isOtpActivated ? undefined : <WarningIcon color='orange' />
            }
          >
            {short ? (
              <UserIcon />
            ) : (
              `${session?.user.first_name} ${session?.user.last_name}`
            )}
          </MenuButton>
        </Tooltip>
      </Skeleton>
      <MenuList>
        <MenuGroup title={t('header.profile')}>
          <MenuItem
            data-testid='menu-information'
            as={Link}
            href='/account/information'
            pl={6}
          >
            {t('information')}
          </MenuItem>
          <MenuItem
            data-testid='menu-credentials'
            as={Link}
            href='/account/credentials'
            pl={6}
          >
            {t('credentials')}
          </MenuItem>
          <MenuItem
            data-testid='menu-projects'
            as={Link}
            href='/account/projects'
            pl={6}
          >
            {t('projects')}
          </MenuItem>
        </MenuGroup>
        {status !== 'loading' && session?.user.role === 'admin' && (
          <React.Fragment>
            <MenuDivider marginLeft={3} marginRight={3} />
            <MenuGroup title={t('header.admin')}>
              <MenuItem data-testid='menu-users' as={Link} href='/users' pl={6}>
                {t('users')}
              </MenuItem>
            </MenuGroup>
          </React.Fragment>
        )}
        <MenuGroup title={t('header.languages')}>
          <MenuItem onClick={() => handleLanguageSelect('en')} pl={6}>
            English
          </MenuItem>
          <MenuItem onClick={() => handleLanguageSelect('fr')} pl={6}>
            Français
          </MenuItem>
        </MenuGroup>
        <MenuDivider marginLeft={3} marginRight={3} />
        <MenuItem onClick={handleSignOut}>{t('logout')}</MenuItem>
      </MenuList>
    </Menu>
  )
}

export default UserMenu
