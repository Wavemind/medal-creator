/**
 * The external imports
 */
import {
  Button,
  Menu,
  MenuButton,
  MenuList,
  MenuItem,
  IconButton,
  Box,
  Text,
  HStack,
} from '@chakra-ui/react'

/**
 * The internal imports
 */
import { TableColumns } from '../config/tableColumns'
import {
  ShowMoreIcon,
  OverflowMenuIcon,
  InformationIcon,
  EditIcon,
  DuplicateIcon,
  DeleteIcon,
} from '/assets/icons'
import theme from '../theme'

export const buildTableColumns = (
  source,
  expandable,
  hasButton,
  buttonLabel,
  onButtonClick,
  hasMenu,
  t
) => {
  const columns = TableColumns[source].map(col => ({
    ...col,
    cell: info => info.getValue(),
  }))

  if (hasButton) {
    columns.push({
      accessorKey: 'openDecisionTree',
      header: null,
      enableColumnFilter: false,
      enableSorting: false,
      cell: info => (
        <Button width='auto' onClick={() => onButtonClick(info)}>
          {buttonLabel}
        </Button>
      ),
    })
  }

  if (hasMenu) {
    columns.push({
      accessorKey: 'menu',
      header: null,
      enableColumnFilter: false,
      enableSorting: false,
      cell: info => (
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
      ),
    })
  }

  return columns
}
