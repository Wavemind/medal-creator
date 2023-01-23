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
  ArchiveIcon,
} from '/assets/icons'
import theme from '/lib/theme'

const MenuCell = ({
  itemId,
  onEdit,
  onDestroy,
  onDuplicate,
  onArchive,
  showUrl,
}) => {
  const { t } = useTranslation('datatable')
  return (
    <Box textAlign='right'>
      <Menu>
        <MenuButton as={IconButton} variant='ghost' data-cy='datatable_menu'>
          <OverflowMenuIcon />
        </MenuButton>
        <MenuList>
          {showUrl && (
            <MenuItem icon={<InformationIcon />} as={Link} href={showUrl}>
              {t('details')}
            </MenuItem>
          )}
          {onEdit && (
            <MenuItem
              data-cy='datatable_edit'
              onClick={() => onEdit(itemId)}
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
              onClick={() => onDestroy(itemId)}
              icon={<DeleteIcon color={theme.colors.secondary} />}
              color={theme.colors.secondary}
            >
              {t('delete')}
            </MenuItem>
          )}
          {onArchive && (
            <MenuItem
              data-cy='datatable_archive'
              onClick={() => onArchive(itemId)}
              icon={<ArchiveIcon color={theme.colors.secondary} />}
              color={theme.colors.secondary}
            >
              {t('archive')}
            </MenuItem>
          )}
        </MenuList>
      </Menu>
    </Box>
  )
}

export default MenuCell
