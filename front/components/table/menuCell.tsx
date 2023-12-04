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
import { Lock, Unlock, Send } from 'lucide-react'

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

// TODO: Take time to find a better way to handle this.
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
  resendInvitation,
  onInfo,
  showUrl,
}) => {
  const { t } = useTranslation('datatable')

  return (
    <Box textAlign='right'>
      <Menu>
        <MenuButton
          as={IconButton}
          variant='ghost'
          data-testid='datatable-menu'
        >
          <OverflowMenuIcon />
        </MenuButton>
        <MenuList>
          {onInfo && (
            <MenuItem onClick={() => onInfo(itemId)} icon={<InformationIcon />}>
              {t('info')}
            </MenuItem>
          )}
          {showUrl && (
            <MenuItem icon={<InformationIcon />} as={Link} href={showUrl}>
              {t('details')}
            </MenuItem>
          )}
          {canEdit && onEdit && (
            <MenuItem onClick={() => onEdit(itemId)} icon={<EditIcon />}>
              {t('edit')}
            </MenuItem>
          )}
          {(onDuplicate || onDestroy || onArchive || canEdit) && (
            <MenuDivider />
          )}
          {onDuplicate && (
            <Tooltip label={t('isDefault')} hasArrow isDisabled={canDuplicate}>
              <MenuItem
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
                onClick={() => onDestroy(itemId)}
                icon={<DeleteIcon />}
                isDisabled={!canDestroy}
              >
                {t('delete')}
              </MenuItem>
            </Tooltip>
          )}
          {onArchive && (
            <MenuItem onClick={() => onArchive(itemId)} icon={<ArchiveIcon />}>
              {t('archive')}
            </MenuItem>
          )}
          {resendInvitation && (
            <MenuItem
              onClick={() => resendInvitation(itemId)}
              icon={<Icon as={Send} h={6} w={6} />}
            >
              {t('resendInvitation')}
            </MenuItem>
          )}
          {onLock && (
            <MenuItem
              onClick={() => onLock(itemId)}
              icon={<Icon as={Lock} h={6} w={6} />}
            >
              {t('lock')}
            </MenuItem>
          )}
          {onUnlock && (
            <MenuItem
              onClick={() => onUnlock(itemId)}
              icon={<Icon as={Unlock} h={6} w={6} />}
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
