/**
 * The external imports
 */
import React, { FC, ReactNode, useEffect, useState } from 'react'
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

/**
 * Type definitions
 */
// TODO : Edge devrait certainement aller dans les types RTK,
// mais a voir comment on peut generaliser la structure
interface Edge {
  node: Element
}

// TODO : Put this somewhere common
interface Element {
  id: number
  isAdmin: boolean
}

interface Props {
  source: string
  sortable?: boolean
  searchable?: boolean
  searchPlaceholder?: string
  title: string
  // TODO : Trouver quelle type utiliser pour apiQuery qui est du style useLazy...
  apiQuery: React.Dispatch<React.SetStateAction<string>>
  requestParams?: object
  renderItem: (el: Element) => ReactNode
  perPage?: number
  paginable?: boolean
}

const DataTable: FC<Props> = ({
  source,
  sortable = false,
  searchable = false,
  searchPlaceholder = '',
  title,
  apiQuery,
  requestParams = {},
  renderItem,
  perPage = DEFAULT_TABLE_PER_PAGE,
  paginable = true,
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
              data?.edges.map((row: Edge) => (
                <React.Fragment key={`datatable-${row.node.id}`}>
                  {renderItem(row.node, tableState.search)}
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
