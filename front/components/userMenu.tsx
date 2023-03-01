/**
 * The external imports
 */
import { useEffect } from 'react'
import { useTranslation } from 'next-i18next'
import { useRouter } from 'next/router'
import {
  Menu,
  MenuButton,
  MenuList,
  MenuItem,
  MenuDivider,
  IconButton,
  useConst,
} from '@chakra-ui/react'
import Link from 'next/link'
import { signOut } from 'next-auth/react'

/**
 * The internal imports
 */
import { UserIcon } from '@/assets/icons'
import { useDeleteSessionMutation } from '@/lib/services/modules/session'
// import getUserBySession from '@/lib/utils/getUserBySession'
import { useSession } from 'next-auth/react'

const UserMenu = () => {
  const { t } = useTranslation('common')
  const router = useRouter()
  const session = useSession()

  console.log(session)

  // const [signOut, signOutValues] = useDeleteSessionMutation()

  // TODO -> CHECK TO PASS IT FROM SSR
  // const currentUser = useConst(() => getUserBySession(undefined, undefined))

  // useEffect(() => {
  //   if (signOutValues.isSuccess) {
  //     router.push('/auth/sign-in')
  //   }
  // }, [signOutValues])

  // CLEAR STORE
  const handleSignOut = () => signOut()

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
        {session.status !== 'loading' && session.data.user.role === 'admin' && (
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
