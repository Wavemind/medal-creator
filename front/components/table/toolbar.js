/**
 * The external imports
 */
import { useMemo } from 'react'
import {
  Button,
  Menu,
  MenuButton,
  MenuList,
  MenuItem,
  HStack,
  Text,
} from '@chakra-ui/react'
import { useTranslation } from 'next-i18next'

/**
 * The internal imports
 */
import { SortIcon } from '/assets/icons'
import { Autocomplete } from '/components'

const Toolbar = ({
  data,
  sortable,
  headers,
  searchable,
  search,
  setSearch,
  title,
}) => {
  const { t } = useTranslation('datatable')

  /**
   * Filters the columns to keep only the sortable ones
   */
  const sortableColumns = useMemo(
    () => headers.filter(header => header.column.getCanSort()),
    [headers]
  )

  return (
    <HStack align='center' justify='space-between' pl={6} pr={10} py={5}>
      {title && <Text fontWeight='bold'>{title}</Text>}
      {searchable && (
        <Autocomplete data={data} search={search} setSearch={setSearch} />
      )}
      {sortable && (
        <Menu>
          <MenuButton as={Button} leftIcon={<SortIcon />} variant='ghost'>
            {t('sort')}
          </MenuButton>
          <MenuList>
            {sortableColumns.map(col => (
              <MenuItem
                key={col.id}
                {...{
                  // Please don't ask me why I have to do this. It doesn't work otherwise :(
                  onClick: col.column.getToggleSortingHandler(),
                }}
              >
                {col.column.columnDef.header}
              </MenuItem>
            ))}
          </MenuList>
        </Menu>
      )}
    </HStack>
  )
}

export default Toolbar
