/**
 * The external imports
 */
import { useTranslation } from 'next-i18next'
import {
  Menu,
  MenuButton,
  MenuList,
  MenuItem,
  MenuDivider,
  IconButton,
} from '@chakra-ui/react'
import Link from 'next/link'
import { signOut } from 'next-auth/react'

/**
 * The internal imports
 */
import { UserIcon } from '@/assets/icons'
import { useSession } from 'next-auth/react'
import { useAppDispatch } from '@/lib/hooks'
import { apiGraphql } from '@/lib/services/apiGraphql'
import { apiRest } from '@/lib/services/apiRest'

const UserMenu = () => {
  const { t } = useTranslation('common')
  const session = useSession()
  const dispatch = useAppDispatch()

  /**
   * Signs out from next-auth and clears the api
   */
  // TODO : Make call to backend to inform it of the sign out
  // => https://next-auth.js.org/configuration/options#events
  // => https://next-auth.js.org/configuration/events#signout
  const handleSignOut = () => {
    signOut({ callbackUrl: '/auth/sign-in' })
    dispatch(apiGraphql.util.resetApiState())
    dispatch(apiRest.util.resetApiState())
  }

  return (
    <Menu>
      <MenuButton as={IconButton} flex={0} data-cy='user_menu'>
        <UserIcon boxSize={6} />
      </MenuButton>
      <MenuList>
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
        {session.status !== 'loading' &&
          session.data?.user.role === 'admin' && (
            <MenuItem data-cy='menu_users' as={Link} href='/users'>
              {t('users')}
            </MenuItem>
          )}
        <MenuDivider marginLeft={3} marginRight={3} />
        <MenuItem onClick={handleSignOut}>{t('logout')}</MenuItem>
      </MenuList>
    </Menu>
  )
}

export default UserMenu
