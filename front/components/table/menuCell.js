/**
 * The external imports
 */
import {
  Menu,
  MenuButton,
  MenuList,
  MenuItem,
  IconButton,
  Box,
} from '@chakra-ui/react'
import { useTranslation } from 'next-i18next'
import Link from 'next/link'

/**
 * The internal imports
 */
import {
  OverflowMenuIcon,
  InformationIcon,
  EditIcon,
  DuplicateIcon,
  DeleteIcon,
} from '/assets/icons'
import theme from '/lib/theme'

const MenuCell = ({ row, onEdit, onDestroy, onDuplicate, onShow }) => {
  const { t } = useTranslation('datatable')
  return (
    <Box textAlign='right'>
      <Menu>
        <MenuButton as={IconButton} variant='ghost' data-cy='datatable_menu'>
          <OverflowMenuIcon />
        </MenuButton>
        <MenuList>
          {onShow && (
            <MenuItem icon={<InformationIcon />} as={Link} href={onShow}>
              {t('details')}
            </MenuItem>
          )}
          {onEdit && (
            <MenuItem
              data-cy='datatable_edit'
              onClick={() => onEdit(row.id)}
              icon={<EditIcon />}
            >
              {t('edit')}
            </MenuItem>
          )}
          {onDuplicate && (
            <MenuItem icon={<DuplicateIcon />}>{t('duplicate')}</MenuItem>
          )}
          {onDestroy && (
            <MenuItem
              data-cy='datatable_destroy'
              onClick={() => onDestroy(row.id)}
              icon={<DeleteIcon color={theme.colors.secondary} />}
              color={theme.colors.secondary}
            >
              {t('delete')}
            </MenuItem>
          )}
        </MenuList>
      </Menu>
    </Box>
  )
}

export default MenuCell
