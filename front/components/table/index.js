/**
 * The external imports
 */
import React, { useMemo, useState } from 'react'
import { useTranslation } from 'next-i18next'
import {
  useReactTable,
  flexRender,
  getCoreRowModel,
  getSortedRowModel,
  getPaginationRowModel,
  getExpandedRowModel,
} from '@tanstack/react-table'
import { Table, Thead, Tbody, Tr, Td, Th, Box } from '@chakra-ui/react'

/**
 * The internal imports
 */
import Toolbar from './toolbar'
import Pagination from './pagination'
import ExpandedRow from './expandedRow'
import { buildTableColumns } from '../../utils/buildTableColumns'

const DataTable = ({
  source,
  data,
  hasMenu = true,
  sortable = false,
  filterable = false,
  expandable = false,
  hasButton = false,
  buttonLabel,
  onButtonClick,
}) => {
  const { t } = useTranslation('datatable')

  const [sorting, setSorting] = useState([])
  const [expanded, setExpanded] = useState({})

  const tableColumns = useMemo(
    () =>
      buildTableColumns(
        source,
        expandable,
        hasButton,
        buttonLabel,
        onButtonClick,
        hasMenu,
        t
      ),
    [source]
  )

  const table = useReactTable({
    data,
    // HAHAHAHAHAHAHAH only way ive found so far to override row expansion
    getRowCanExpand: () => expandable,
    columns: tableColumns,
    getCoreRowModel: getCoreRowModel(),
    initialState: {
      pagination: {
        pageSize: 2,
      },
    },
    state: {
      sorting,
      expanded,
    },
    onExpandedChange: setExpanded,
    onSortingChange: setSorting,
    getSortedRowModel: getSortedRowModel(),
    getPaginationRowModel: getPaginationRowModel(),
    getExpandedRowModel: getExpandedRowModel(),
    debugTable: true,
  })

  const headers = useMemo(() => {
    if (table.getHeaderGroups) {
      return table.getHeaderGroups()[0].headers
    }
    return []
  }, [table.getHeaderGroups])

  return (
    <Box
      style={{
        margin: 100,
        borderRadius: 10,
        boxShadow: '0px 0px 3px grey',
      }}
    >
      <Toolbar
        source={source}
        sortable={sortable}
        filterable={filterable}
        headers={headers}
      />
      <Table>
        <Thead>
          <Tr>
            {headers.map(header => (
              <Th
                key={header.id}
                textTransform="none"
                fontWeight={header.column.getIsSorted() ? 'bold' : 'normal'}
              >
                {flexRender(
                  header.column.columnDef.header,
                  header.getContext()
                )}
              </Th>
            ))}
          </Tr>
        </Thead>
        <Tbody>
          {table.getRowModel().rows.map(row => (
            <React.Fragment key={row.id}>
              <Tr>
                {row.getVisibleCells().map((cell, index) => (
                  <Td key={cell.id} fontWeight={index === 0 ? '900' : 'normal'}>
                    {flexRender(cell.column.columnDef.cell, cell.getContext())}
                  </Td>
                ))}
              </Tr>
              {row.getIsExpanded() && <ExpandedRow row={row} />}
            </React.Fragment>
          ))}
        </Tbody>
      </Table>
      <Pagination table={table} />
    </Box>
  )
}

export default DataTable
