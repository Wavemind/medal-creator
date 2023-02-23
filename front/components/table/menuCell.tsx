/**
 * The external imports
 */
import { FC } from 'react'
import {
  Menu,
  MenuButton,
  MenuList,
  MenuItem,
  IconButton,
  Icon,
  Box,
} from '@chakra-ui/react'
import { useTranslation } from 'next-i18next'
import Link from 'next/link'
import { AiOutlineLock, AiOutlineUnlock } from 'react-icons/ai'

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
  AddIcon,
} from '@/assets/icons'
import theme from '@/lib/theme'

type MenuCellProps = {
  itemId: number
  onEdit?: (id: number) => void
  onDestroy?: (id: number) => void
  onDuplicate?: (id: number) => void
  onArchive?: (id: number) => void
  onLock?: (id: number) => void
  onUnlock?: (id: number) => void
  onInfo?: (id: number) => void
  onNew?: (id: number) => void
  showUrl?: string
}

// TODO : Finalize onDuplicate
const MenuCell: FC<MenuCellProps> = ({
  itemId,
  onEdit,
  onDestroy,
  onDuplicate,
  onArchive,
  onLock,
  onUnlock,
  onInfo,
  onNew,
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
          {onInfo && (
            <MenuItem
              data-cy='datatable_info'
              onClick={() => onInfo(itemId)}
              icon={<InformationIcon />}
            >
              {t('info')}
            </MenuItem>
          )}
          {showUrl && (
            <MenuItem
              data-cy='datatable_show'
              icon={<InformationIcon />}
              as={Link}
              href={showUrl}
            >
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
          {onNew && (
            <MenuItem
              data-cy='datatable_new'
              onClick={() => onNew(itemId)}
              icon={<AddIcon color='green.500' />}
              color='green.500'
            >
              {t('newDiagnosis')}
            </MenuItem>
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
          {onLock && (
            <MenuItem
              data-cy='datatable_lock'
              onClick={() => onLock(itemId)}
              icon={
                <Icon
                  as={AiOutlineLock}
                  color={theme.colors.secondary}
                  h={6}
                  w={6}
                />
              }
              color={theme.colors.secondary}
            >
              {t('lock')}
            </MenuItem>
          )}
          {onUnlock && (
            <MenuItem
              data-cy='datatable_unlock'
              onClick={() => onUnlock(itemId)}
              icon={
                <Icon
                  as={AiOutlineUnlock}
                  color={theme.colors.secondary}
                  h={6}
                  w={6}
                />
              }
              color={theme.colors.secondary}
            >
              {t('unlock')}
            </MenuItem>
          )}
        </MenuList>
      </Menu>
    </Box>
  )
}

export default MenuCell
