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
import OverflowMenuIcon from '@/assets/icons/OverflowMenu'
import InformationIcon from '@/assets/icons/Information'
import EditIcon from '@/assets/icons/Edit'
import DuplicateIcon from '@/assets/icons/Duplicate'
import DeleteIcon from '@/assets/icons/Delete'
import ArchiveIcon from '@/assets/icons/Archive'

import type { MenuCellComponent } from '@/types'

const MenuCell: MenuCellComponent = ({
  itemId,
  onEdit,
  onDestroy,
  canEdit = true,
  canDestroy = true,
  canDuplicate = true,
  onDuplicate,
  onArchive,
  onLock,
  onUnlock,
  onInfo,
  showUrl,
}) => {
  const { t } = useTranslation('datatable')

  // TODO: Improvement needed
  return (
    <Box textAlign='right'>
      <Menu>
        <MenuButton
          as={IconButton}
          variant='ghost'
          data-cy={`datatable-menu-${itemId}`}
        >
          <OverflowMenuIcon />
        </MenuButton>
        <MenuList>
          {onInfo && (
            <MenuItem
              data-cy={`datatable-menu-info-${itemId}`}
              onClick={() => onInfo(itemId)}
              icon={<InformationIcon />}
            >
              {t('info')}
            </MenuItem>
          )}
          {showUrl && (
            <MenuItem
              data-cy={`datatable-menu-show-${itemId}`}
              icon={<InformationIcon />}
              as={Link}
              href={showUrl}
            >
              {t('details')}
            </MenuItem>
          )}
          {canEdit && onEdit && (
            <MenuItem
              data-cy={`datatable-menu-edit-${itemId}`}
              onClick={() => onEdit(itemId)}
              icon={<EditIcon />}
            >
              {t('edit')}
            </MenuItem>
          )}
          {(onDuplicate || onDestroy || onArchive) && <MenuDivider />}
          {onDuplicate && (
            <Tooltip label={t('isDefault')} hasArrow isDisabled={canDuplicate}>
              <MenuItem
                data-cy={`datatable-menu-duplicate-${itemId}`}
                onClick={() => onDuplicate(itemId)}
                icon={<DuplicateIcon />}
                isDisabled={!canDuplicate}
              >
                {t('duplicate')}
              </MenuItem>
            </Tooltip>
          )}
          {onDestroy && (
            <Tooltip label={t('hasInstances')} hasArrow isDisabled={canDestroy}>
              <MenuItem
                data-cy={`datatable-menu-destroy-${itemId}`}
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
              data-cy={`datatable-menu-archive-${itemId}`}
              onClick={() => onArchive(itemId)}
              icon={<ArchiveIcon />}
            >
              {t('archive')}
            </MenuItem>
          )}
          {onLock && (
            <MenuItem
              data-cy={`datatable-menu-lock-${itemId}`}
              onClick={() => onLock(itemId)}
              icon={<Icon as={AiOutlineLock} h={6} w={6} />}
            >
              {t('lock')}
            </MenuItem>
          )}
          {onUnlock && (
            <MenuItem
              data-cy={`datatable-menu-unlock-${itemId}`}
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
