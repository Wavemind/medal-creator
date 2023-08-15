/**
 * The external imports
 */
import { FC } from 'react'
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
import { useSession } from 'next-auth/react'

/**
 * The internal imports
 */
import UserIcon from '@/assets/icons/User'

const UserMenu: FC = () => {
  const { t } = useTranslation('common')
  const { data, status } = useSession()

  const handleSignOut = () => signOut({ callbackUrl: '/auth/sign-in' })

  return (
    <Menu>
      <MenuButton as={IconButton} p={3} flex={0} data-cy='user-menu' size='lg'>
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
        {status !== 'loading' && data?.user.role === 'admin' && (
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
