/**
 * The external imports
 */
import { i18n } from 'next-i18next'

/**
 * The internal imports
 */
import { TableColumns } from '../config/tableColumns'
import { formatDate } from './date'
import MenuCell from '/components/table/menuCell'
import ButtonCell from '/components/table/buttonCell'

export const buildTableColumns = (
  source,
  expandable,
  hasButton,
  buttonLabelKey,
  onButtonClick,
  hasMenu,
  editable,
  onEditClick
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
        case 'enum':
          return i18n.t(`enum.${col.accessorKey}.${info.getValue()}`, {
            ns: source,
          })
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
        <ButtonCell
          info={info}
          onButtonClick={onButtonClick}
          labelKey={buttonLabelKey}
        />
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
        <MenuCell
          info={info}
          expandable={expandable}
          editable={editable}
          onEditClick={onEditClick}
        />
      ),
    })
  }

  return columns
}
