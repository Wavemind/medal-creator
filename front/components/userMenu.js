/**
 * The external imports
 */
import { useEffect, useMemo } from 'react'
import { useTranslation } from 'next-i18next'
import { useRouter } from 'next/router'
import {
  Menu,
  MenuButton,
  MenuList,
  MenuItem,
  MenuDivider,
  IconButton,
} from '@chakra-ui/react'

/**
 * The internal imports
 */
import { UserIcon } from '../assets/icons'
import { useDeleteSessionMutation } from '/lib/services/modules/session'
import getUserBySession from '/lib/utils/getUserBySession'

const UserMenu = () => {
  const { t } = useTranslation('common')
  const router = useRouter()
  const [signOut, signOutValues] = useDeleteSessionMutation()

  useEffect(() => {
    if (signOutValues.isSuccess) {
      router.push('/auth/sign-in')
    }
  }, [signOutValues])

  /**
   * Gets the current user from the cookie and checks whether use is admin
   */
  const isAdmin = useMemo(() => {
    const currentUser = getUserBySession()
    return currentUser.role === 'admin'
  }, [])

  /**
   * Navigates to the page defined in the href
   * @param {*} href String
   */
  const navigate = href => {
    router.push(href)
  }

  return (
    <Menu>
      <MenuButton as={IconButton} flex={0} data-cy='user_menu'>
        <UserIcon boxSize={6} />
      </MenuButton>
      <MenuList>
        <MenuItem
          data-cy='menu_information'
          onClick={() => navigate('/account/information')}
        >
          {t('information')}
        </MenuItem>
        <MenuItem
          data-cy='menu_credentials'
          onClick={() => navigate('/account/credentials')}
        >
          {t('credentials')}
        </MenuItem>
        <MenuItem
          data-cy='menu_projects'
          onClick={() => navigate('/account/projects')}
        >
          {t('projects')}
        </MenuItem>
        {isAdmin && (
          <MenuItem data-cy='menu_users' onClick={() => navigate('/users')}>
            {t('users', { ns: 'common' })}
          </MenuItem>
        )}
        <MenuDivider marginLeft={3} marginRight={3} />
        <MenuItem onClick={signOut}>{t('logout')}</MenuItem>
      </MenuList>
    </Menu>
  )
}

export default UserMenu
