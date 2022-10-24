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
} from '@chakra-ui/react'

/**
 * The internal imports
 */
import { UserIcon } from '../assets/icons'
import { useDeleteSessionMutation } from '/lib/services/modules/session'

const UserMenu = () => {
  const { t } = useTranslation('common')
  const router = useRouter()
  const [signOut, signOutValues] = useDeleteSessionMutation()

  useEffect(() => {
    if (signOutValues.isSuccess) {
      router.push('/auth/sign-in')
    }
  }, [signOutValues])

  return (
    <Menu>
      <MenuButton as={IconButton} flex={0} data-cy='user_menu'>
        <UserIcon boxSize={6} />
      </MenuButton>
      <MenuList>
        <MenuItem
          data-cy='menu_information'
          onClick={() => router.push('/account/information')}
        >
          {t('information')}
        </MenuItem>
        <MenuItem
          data-cy='menu_credentials'
          onClick={() => router.push('/account/credentials')}
        >
          {t('credentials')}
        </MenuItem>
        <MenuItem
          data-cy='menu_projects'
          onClick={() => router.push('/account/projects')}
        >
          {t('projects')}
        </MenuItem>
        <MenuDivider marginLeft={3} marginRight={3} />
        <MenuItem onClick={signOut}>{t('logout')}</MenuItem>
      </MenuList>
    </Menu>
  )
}

export default UserMenu
