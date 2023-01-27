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
import { DEFAULT_TABLE_PER_PAGE } from '/lib/config/constants'
import { TableColumns } from '/lib/config/tableColumns'

const DataTable = ({
  source,
  sortable = false,
  searchable = false,
  searchPlaceholder = '',
  title,
  apiQuery,
  requestParams = {},
  renderItem,
  perPage = DEFAULT_TABLE_PER_PAGE,
}) => {
  const { t } = useTranslation('datatable')

  const [tableState, setTableState] = useState({
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
    if (isSuccess) {
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
      boxShadow='lg'
      border='1px'
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
        title={title}
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
              data?.edges.map(row => (
                <React.Fragment key={`datatable-${row.node.id}`}>
                  {renderItem(row.node)}
                </React.Fragment>
              ))
            )}
          </Tbody>
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
        </Table>
      </TableContainer>
    </Box>
  )
}

export default DataTable
