/**
 * The external imports
 */
import React, { FC } from 'react'
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
import { signOut } from 'next-auth/react'
import { useSession } from 'next-auth/react'

/**
 * The internal imports
 */
import { ChevronDownIcon } from '@chakra-ui/icons'
import WarningIcon from '@/assets/icons/Warning'
import UserIcon from '@/assets/icons/User'
import { useAppRouter } from '@/lib/hooks/useAppRouter'

const UserMenu: FC<{ short?: boolean }> = ({ short = false }) => {
  const { t } = useTranslation('common')
  const router = useAppRouter()

  const { data, status } = useSession()

  const handleSignOut = () => signOut({ callbackUrl: '/auth/sign-in' })

  const isOtpActivated = data?.user.otp_required_for_login || false

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
            data-cy='user-menu'
            rightIcon={short ? <React.Fragment /> : <ChevronDownIcon />}
            leftIcon={<WarningIcon color='orange' />}
          >
            {short ? (
              <UserIcon />
            ) : (
              `${data?.user.first_name} ${data?.user.last_name}`
            )}
          </MenuButton>
        </Tooltip>
      </Skeleton>
      <MenuList>
        <MenuGroup title={t('header.profile')}>
          <MenuItem
            data-cy='menu_information'
            as={Link}
            href='/account/information'
          >
            {t('information')}
          </MenuItem>
          <MenuItem
            data-cy='menu_credentials'
            as={Link}
            href='/account/credentials'
          >
            {t('credentials')}
          </MenuItem>
          <MenuItem data-cy='menu_projects' as={Link} href='/account/projects'>
            {t('projects')}
          </MenuItem>
        </MenuGroup>
        <MenuDivider marginLeft={3} marginRight={3} />
        {status !== 'loading' && data?.user.role === 'admin' && (
          <React.Fragment>
            <MenuDivider marginLeft={3} marginRight={3} />
            <MenuGroup title={t('header.admin')}>
              <MenuItem data-cy='menu_users' as={Link} href='/users'>
                {t('users')}
              </MenuItem>
            </MenuGroup>
          </React.Fragment>
        )}
        <MenuGroup title={t('header.languages')}>
          <MenuItem onClick={() => handleLanguageSelect('en')}>
            English
          </MenuItem>
          <MenuItem onClick={() => handleLanguageSelect('fr')}>
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
