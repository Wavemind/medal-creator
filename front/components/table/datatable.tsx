/**
 * The external imports
 */
import React, { FC, useEffect, useState } from 'react'
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
import { DEFAULT_TABLE_PER_PAGE } from '@/lib/config/constants'
import { TableColumns } from '@/lib/config/tableColumns'

import type { TableState, DatatableProps } from '@/types/datatable'

const DataTable: FC<DatatableProps> = ({
  source,
  sortable = false,
  searchable = false,
  searchPlaceholder = '',
  apiQuery,
  requestParams = {},
  renderItem,
  perPage = DEFAULT_TABLE_PER_PAGE,
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

  // TODO: Need more investigation to improve this
  const [getData, { data, isSuccess }] = apiQuery()

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

  return (
    <Box
      boxShadow='0px 0px 4px rgba(0, 0, 0, 0.15)'
      border={1}
      borderColor='sidebar'
      borderRadius='lg'
      my={5}
    >
      <Toolbar
        sortable={sortable}
        source={source}
        searchable={searchable}
        tableState={tableState}
        searchPlaceholder={searchPlaceholder}
        setTableState={setTableState}
      />
      <TableContainer>
        <Table>
          <Thead>
            <Tr>
              {TableColumns[source].map(column => (
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
