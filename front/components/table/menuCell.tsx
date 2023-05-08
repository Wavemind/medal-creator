/**
 * The external imports
 */
import {
  Menu,
  MenuButton,
  MenuList,
  MenuItem,
  IconButton,
  Icon,
  Box,
  MenuDivider,
  Tooltip,
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
import type { MenuCellComponent } from '@/types'

const MenuCell: MenuCellComponent = ({
  itemId,
  onEdit,
  onDestroy,
  canDestroy,
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
          {(onDuplicate || onNew || onDestroy || onArchive) && <MenuDivider />}
          {onDuplicate && (
            <MenuItem
              data-cy='datatable_duplicate'
              onClick={() => onDuplicate(itemId)}
              icon={<DuplicateIcon />}
            >
              {t('duplicate')}
            </MenuItem>
          )}
          {onNew && (
            <MenuItem
              data-cy='datatable_new'
              onClick={() => onNew(itemId)}
              icon={<AddIcon />}
            >
              {t('newDiagnosis')}
            </MenuItem>
          )}
          {onDestroy && (
            <Tooltip label={t('hasInstances')} hasArrow isDisabled={canDestroy}>
              <MenuItem
                data-cy='datatable_destroy'
                onClick={() => onDestroy(itemId)}
                icon={<DeleteIcon />}
                isDisabled={!canDestroy}
              >
                {t('delete')}
              </MenuItem>
            </Tooltip>
          )}
          {onArchive && (
            <MenuItem
              data-cy='datatable_archive'
              onClick={() => onArchive(itemId)}
              icon={<ArchiveIcon />}
            >
              {t('archive')}
            </MenuItem>
          )}
          {onLock && (
            <MenuItem
              data-cy='datatable_lock'
              onClick={() => onLock(itemId)}
              icon={<Icon as={AiOutlineLock} h={6} w={6} />}
            >
              {t('lock')}
            </MenuItem>
          )}
          {onUnlock && (
            <MenuItem
              data-cy='datatable_unlock'
              onClick={() => onUnlock(itemId)}
              icon={<Icon as={AiOutlineUnlock} h={6} w={6} />}
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
