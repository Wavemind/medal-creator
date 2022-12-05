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
  Text,
  HStack,
} from '@chakra-ui/react'
import { useTranslation } from 'next-i18next'

/**
 * The internal imports
 */
import {
  ShowMoreIcon,
  OverflowMenuIcon,
  InformationIcon,
  EditIcon,
  DuplicateIcon,
  DeleteIcon,
} from '/assets/icons'
import theme from '/lib/theme'

const MenuCell = ({
  row,
  expandable,
  editable,
  onEditClick,
  destroyable,
  handleDestroyClick,
}) => {
  const { t } = useTranslation('datatable')

  return (
    <Box textAlign='right'>
      <Menu>
        <MenuButton as={IconButton} variant='ghost' data-cy='datatable_menu'>
          <OverflowMenuIcon />
        </MenuButton>
        <MenuList>
          <MenuItem icon={<InformationIcon />}>{t('details')}</MenuItem>
          {editable && (
            <MenuItem
              data-cy='datatable_edit'
              onClick={() => onEditClick(row.id)}
              icon={<EditIcon />}
            >
              {t('edit')}
            </MenuItem>
          )}
          <MenuItem icon={<DuplicateIcon />}>{t('duplicate')}</MenuItem>
          {destroyable && (
            <MenuItem
              data-cy='datatable_destroy'
              onClick={() => handleDestroyClick(row.id)}
              icon={<DeleteIcon color={theme.colors.secondary} />}
              color={theme.colors.secondary}
            >
              {t('delete')}
            </MenuItem>
          )}
        </MenuList>
      </Menu>
      {expandable && row.subrows.count > 0 && (
        <HStack
          justifyContent='end'
          cursor='pointer'
          onClick={() => console.log('toggle expanded')}
        >
          {/* TODO Recuperer les textes passés en parametre */}
          <Text fontSize='xs'>Show decision trees</Text>
          <ShowMoreIcon />
        </HStack>
      )}
    </Box>
  )
}

export default MenuCell
