/**
 * The external imports
 */
import { Button } from '@chakra-ui/react'

/**
 * The internal imports
 */
import { TableColumns } from '../config/tableColumns'
import { formatDate } from './date'
import MenuCell from '/components/table/menuCell'

export const buildTableColumns = (
  source,
  expandable,
  hasButton,
  buttonLabel,
  onButtonClick,
  hasMenu
) => {
  const columns = TableColumns[source].map(col => ({
    ...col,
    header: col.accessorKey,
    cell: info => {
      switch (col.type) {
        case 'string':
          return info.getValue()
        case 'date':
          return formatDate(new Date(info.getValue()))
        default:
          return null
      }
    },
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
      cell: info => <MenuCell info={info} expandable={expandable} />,
    })
  }

  return columns
}
