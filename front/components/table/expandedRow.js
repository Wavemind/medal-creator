/**
 * The external imports
 */
import React, { useMemo } from 'react'
import { Tr, Td, Table, Thead, Th, Tbody, useTheme } from '@chakra-ui/react'
import {
  useReactTable,
  flexRender,
  getCoreRowModel,
} from '@tanstack/react-table'
import { useTranslation } from 'next-i18next'

/**
 * The internal imports
 */
import { buildTableColumns } from '../../utils/buildTableColumns'

const ExpandedRow = ({ row }) => {
  const { t } = useTranslation('datatable')
  const { colors } = useTheme()

  const handleButtonClick = info => {
    console.log(info)
  }

  const tableColumns = useMemo(
    // TODO Generalize this when we know what the data looks like
    () =>
      buildTableColumns(
        'diagnosis',
        false,
        true,
        'Open diagnosis',
        handleButtonClick,
        true,
        t
      ),
    []
  )

  const table = useReactTable({
    data: row.original.subRows,
    columns: tableColumns,
    getCoreRowModel: getCoreRowModel(),
  })

  return (
    <Tr>
      <Td
        colSpan={row.getVisibleCells().length}
        paddingBottom={0}
        paddingLeft={100}
        paddingRight={0}
      >
        <Table>
          <Thead>
            <Tr>
              {table.getHeaderGroups()[0].headers.map(header => (
                <Th key={header.id} textTransform="none">
                  {flexRender(
                    header.column.columnDef.header,
                    header.getContext()
                  )}
                </Th>
              ))}
            </Tr>
          </Thead>
          <Tbody backgroundColor={colors.third}>
            {table.getRowModel().rows.map(nestedRow => (
              <Tr key={nestedRow.id}>
                {nestedRow.getVisibleCells().map((cell, index) => (
                  <Td key={cell.id} fontWeight={index === 0 ? '900' : 'normal'}>
                    {flexRender(cell.column.columnDef.cell, cell.getContext())}
                  </Td>
                ))}
              </Tr>
            ))}
          </Tbody>
        </Table>
      </Td>
    </Tr>
  )
}

export default ExpandedRow
