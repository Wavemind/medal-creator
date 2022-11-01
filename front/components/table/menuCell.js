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

const MenuCell = ({ info, expandable }) => {
  const { t } = useTranslation('datatable')

  return (
    <Box textAlign='right'>
      <Menu>
        <MenuButton as={IconButton} variant='ghost'>
          <OverflowMenuIcon />
        </MenuButton>
        <MenuList>
          <MenuItem icon={<InformationIcon />}>{t('details')}</MenuItem>
          <MenuItem icon={<EditIcon />}>{t('edit')}</MenuItem>
          <MenuItem icon={<DuplicateIcon />}>{t('duplicate')}</MenuItem>
          <MenuItem
            icon={<DeleteIcon color={theme.colors.secondary} />}
            color={theme.colors.secondary}
          >
            {t('delete')}
          </MenuItem>
        </MenuList>
      </Menu>
      {expandable && info.row.original.subRows?.length > 0 && (
        <HStack
          justifyContent='end'
          cursor='pointer'
          {...{
            // Please don't ask me why I have to do this. It doesn't work otherwise :(
            onClick: info.row.getToggleExpandedHandler(),
          }}
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
