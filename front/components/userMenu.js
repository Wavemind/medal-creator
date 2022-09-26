/**
 * The external imports
 */
import React from 'react'
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

const UserMenu = () => {
  const { t } = useTranslation('common')
  const router = useRouter()

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
          data-cy='menu_password'
          onClick={() => router.push('/account/password')}
        >
          {t('password')}
        </MenuItem>
        <MenuItem
          data-cy='menu_projects'
          onClick={() => router.push('/account/projects')}
        >
          {t('projects')}
        </MenuItem>
        <MenuDivider marginLeft={3} marginRight={3} />
        <MenuItem>{t('logout')}</MenuItem>
      </MenuList>
    </Menu>
  )
}

export default UserMenu
