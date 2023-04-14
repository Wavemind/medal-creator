/**
 * The external imports
 */
import React, { useEffect, useState } from 'react'
import { useTranslation } from 'next-i18next'
import {
  Table,
  Thead,
  Tbody,
  Tfoot,
  Tr,
  Td,
  Th,
  Box,
  TableContainer,
  Text,
} from '@chakra-ui/react'

/**
 * The internal imports
 */
import Toolbar from './toolbar'
import Pagination from './pagination'
import ErrorMessage from '../errorMessage'
import { TABLE_COLUMNS } from '@/lib/config/constants'
import { DatatableService } from '@/lib/services'
import type { TableState, DatatableComponent } from '@/types'

const DataTable: DatatableComponent = ({
  source,
  sortable = false,
  searchable = false,
  searchPlaceholder = '',
  apiQuery,
  requestParams = {},
  renderItem,
  perPage = DatatableService.DEFAULT_TABLE_PER_PAGE,
  paginable = true,
}) => {
  const { t } = useTranslation('datatable')

  const [tableState, setTableState] = useState<TableState>({
    perPage,
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

  const [getData, { data, isSuccess, isError, error }] = apiQuery()

  /**
   * Fetch data when pagination changes
   */
  useEffect(() => {
    const fetchData = async () => {
      await getData({
        ...requestParams,
        after: tableState.endCursor,
        before: tableState.startCursor,
        searchTerm: tableState.search,
        ...DatatableService.calculatePagination(tableState),
      })
    }
    fetchData()
  }, [tableState.pageIndex, tableState.search])

  /**
   * If the fetch request is successful, update tableData and pagination info
   */
  useEffect(() => {
    if (isSuccess && data) {
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
  }, [data, t])

  if (isError) {
    return <ErrorMessage error={error} />
  }

  return (
    <Box
      boxShadow='0px 0px 4px rgba(0, 0, 0, 0.15)'
      border={1}
      borderColor='sidebar'
      borderRadius='lg'
      my={5}
    >
      {(searchable || sortable) && (
        <Toolbar
          sortable={sortable}
          source={source}
          searchable={searchable}
          tableState={tableState}
          searchPlaceholder={searchPlaceholder}
          setTableState={setTableState}
        />
      )}
      <TableContainer>
        <Table>
          <Thead>
            <Tr>
              {TABLE_COLUMNS[source].map(column => (
                <Th key={column.accessorKey} colSpan={column.colSpan}>
                  {t(`${source}.${column.accessorKey}`)}
                </Th>
              ))}
            </Tr>
          </Thead>
          <Tbody>
            {data?.edges.length === 0 ? (
              <Tr>
                <Td colSpan={10}>
                  <Text align='center'>{t('noData')}</Text>
                </Td>
              </Tr>
            ) : (
              data?.edges.map((edge: { node: { id: number } }) => (
                <React.Fragment key={`datatable-${edge.node.id}`}>
                  {renderItem(edge.node, tableState.search)}
                </React.Fragment>
              ))
            )}
          </Tbody>
          {paginable && (
            <Tfoot>
              <Tr>
                <Td colSpan={10}>
                  <Pagination
                    setTableState={setTableState}
                    tableState={tableState}
                  />
                </Td>
              </Tr>
            </Tfoot>
          )}
        </Table>
      </TableContainer>
    </Box>
  )
}

export default DataTable
