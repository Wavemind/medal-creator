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
  TableContainer,
  Text,
} from '@chakra-ui/react'

/**
 * The internal imports
 */
import Toolbar from '@/components/table/toolbar'
import Pagination from '@/components/table/pagination'
import ErrorMessage from '@/components/errorMessage'
import Card from '@/components/card'
import { TABLE_COLUMNS } from '@/lib/config/constants'
import DatatableService from '@/lib/services/datatable.service'
import type { TableState, DatatableComponent, Paginated } from '@/types'

const DataTable = <PaginatedQuery extends Paginated<object>>({
  source,
  sortable = false,
  searchable = false,
  searchPlaceholder = '',
  apiQuery,
  requestParams = {},
  renderItem,
  perPage = DatatableService.DEFAULT_TABLE_PER_PAGE,
  paginable = true,
}: DatatableComponent<PaginatedQuery>) => {
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
  }, [tableState.pageIndex, tableState.search, tableState.perPage])

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
    <Card my={5}>
      {(searchable || sortable) && (
        <Toolbar
          sortable={sortable}
          source={source}
          searchable={searchable}
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
                  {t(`${source}.${column.accessorKey}`, { defaultValue: '' })}
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
              data?.edges.map(edge => (
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
    </Card>
  )
}

export default DataTable
