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
  Button,
  Skeleton,
} from '@chakra-ui/react'
import Link from 'next/link'
import { signOut } from 'next-auth/react'
import { useSession } from 'next-auth/react'

/**
 * The internal imports
 */
import { ChevronDownIcon } from '@chakra-ui/icons'

const UserMenu: FC = () => {
  const { t } = useTranslation('common')
  const { data, status } = useSession()

  const handleSignOut = () => signOut({ callbackUrl: '/auth/sign-in' })

  return (
    <Menu>
      <Skeleton isLoaded={status === 'authenticated'} borderRadius='xl'>
        <MenuButton
          minW={36}
          as={Button}
          data-cy='user-menu'
          rightIcon={<ChevronDownIcon />}
        >
          {data?.user.first_name} {data?.user.last_name}
        </MenuButton>
      </Skeleton>
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
