/**
 * The external imports
 */
import React, { useEffect, useMemo, useState } from 'react'
import { useTranslation } from 'next-i18next'
import {
  useReactTable,
  flexRender,
  getCoreRowModel,
  getSortedRowModel,
  getExpandedRowModel,
} from '@tanstack/react-table'
import { Table, Thead, Tbody, Tr, Td, Th, Box } from '@chakra-ui/react'

/**
 * The internal imports
 */
import Toolbar from './toolbar'
import Pagination from './pagination'
import ExpandedRow from './expandedRow'
import { buildTableColumns } from '/lib/utils/buildTableColumns'
import { DEFAULT_TABLE_PER_PAGE } from '/lib/config/constants'

const DataTable = ({
  source,
  hasMenu = true,
  sortable = false,
  expandable = false,
  hasButton = false,
  searchable = false,
  searchPlaceholder = '',
  title,
  buttonLabelKey,
  onButtonClick,
  apiQuery,
  requestParams = {},
  editable = true,
  onEditClick,
}) => {
  const { t } = useTranslation('datatable')

  const [sorting, setSorting] = useState([])
  const [expanded, setExpanded] = useState({})
  const [tableData, setTableData] = useState([])
  const [tableState, setTableState] = useState({
    perPage: DEFAULT_TABLE_PER_PAGE,
    pageIndex: 1,
    pageCount: 0,
    lastPerPage: 0,
    endCursor: '',
    startCursor: '',
    hasNextPage: true,
    hasPreviousPage: false,
    search: '',
    totalCount: 0,
  })

  const [getData, getDataResponse] = apiQuery()

  /**
   * Fetch data when pagination changes
   */
  useEffect(() => {
    const fetchData = async () => {
      await getData({
        ...requestParams,
        ...tableState,
      })
    }
    fetchData()
  }, [tableState.pageIndex, tableState.search])

  /**
   * If the fetch request is successful, update tableData and pagination info
   */
  useEffect(() => {
    if (getDataResponse.isSuccess) {
      const { data } = getDataResponse
      setTableData(data.edges.map(edge => ({ ...edge.node })))

      const pageCount = Math.ceil(data.totalCount / tableState.perPage)
      setTableState(prevState => ({
        ...prevState,
        ...data.pageInfo,
        pageCount,
        totalCount: data.totalCount,
        endCursor: pageCount === 1 ? '' : data.pageInfo.endCursor,
        startCursor: pageCount === 1 ? '' : data.pageInfo.startCursor,
        lastPerPage: data.totalCount % tableState.perPage,
      }))
    }
  }, [getDataResponse])

  /**
   * Builds table columns
   */
  const tableColumns = useMemo(
    () =>
      buildTableColumns(
        source,
        expandable,
        hasButton,
        buttonLabelKey,
        onButtonClick,
        hasMenu,
        editable,
        onEditClick
      ),
    [source]
  )

  /**
   * Builds tables with react-table
   */
  const table = useReactTable({
    columns: tableColumns,
    data: tableData,
    getRowCanExpand: () => expandable,
    getCoreRowModel: getCoreRowModel(),
    state: {
      sorting,
      expanded,
    },
    onExpandedChange: setExpanded,
    onSortingChange: setSorting,
    getSortedRowModel: getSortedRowModel(),
    getExpandedRowModel: getExpandedRowModel(),
    debugTable: true,
    manualPagination: true,
  })

  /**
   * Defines table headers
   */
  const headers = useMemo(() => {
    if (table.getHeaderGroups) {
      return table.getHeaderGroups()[0].headers
    }
    return []
  }, [table.getHeaderGroups])

  return (
    <Box
      boxShadow='lg'
      border='1px'
      borderColor='sidebar'
      borderRadius='lg'
      my={5}
    >
      <Toolbar
        sortable={sortable}
        headers={headers}
        searchable={searchable}
        tableState={tableState}
        searchPlaceholder={searchPlaceholder}
        setTableState={setTableState}
        title={title}
      />
      <Table>
        <Thead>
          <Tr>
            {headers.map(header => (
              <Th
                key={header.id}
                textTransform='none'
                fontWeight={header.column.getIsSorted() ? 'bold' : 'normal'}
                fontSize={14}
              >
                {header.column.columnDef.header &&
                  t(`${source}.${header.column.columnDef.header}`)}
              </Th>
            ))}
          </Tr>
        </Thead>
        <Tbody>
          {table.getRowModel().rows.map(row => (
            <React.Fragment key={row.id}>
              <Tr data-cy='datatable_row'>
                {row.getVisibleCells().map((cell, index) => (
                  <Td
                    key={cell.id}
                    fontWeight={index === 0 ? '900' : 'normal'}
                    fontSize={16}
                  >
                    {flexRender(cell.column.columnDef.cell, cell.getContext())}
                  </Td>
                ))}
              </Tr>
              {row.getIsExpanded() && <ExpandedRow row={row} />}
            </React.Fragment>
          ))}
        </Tbody>
      </Table>
      <Pagination setTableState={setTableState} tableState={tableState} />
    </Box>
  )
}

export default DataTable
