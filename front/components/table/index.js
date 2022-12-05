/**
 * The external imports
 */
import React, { useEffect, useState } from 'react'
import { useTranslation } from 'next-i18next'
import { Table, Thead, Tbody, Tr, Td, Th, Box, Button } from '@chakra-ui/react'

/**
 * The internal imports
 */
import Toolbar from './toolbar'
import Pagination from './pagination'
import ExpandedRow from './expandedRow'
import MenuCell from './menuCell'
import { DEFAULT_TABLE_PER_PAGE } from '/lib/config/constants'
import { TableColumns } from '/lib/config/tableColumns'
import { formatDate } from '/lib/utils/date'

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
  handleEditClick,
  destroyable = true,
  handleDestroyClick,
}) => {
  const { t } = useTranslation('datatable')

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

      const transformedTableData = data.edges.map(edge => {
        const transformedRow = { id: edge.node.id }

        TableColumns[source].forEach(col => {
          const header = col.accessorKey
          const value = edge.node[header]

          switch (col.type) {
            case 'string':
              transformedRow[header] = value
              break
            case 'date':
              transformedRow[header] = formatDate(new Date(value))
              break
            case 'enum':
              transformedRow[header] = t(`enum.${header}.${value}`, {
                ns: source,
              })
              break
            default:
              break
          }
        })
        return transformedRow
      })

      setTableData(transformedTableData)

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
      <Table>
        <Thead>
          <Tr>
            {TableColumns[source].map(column => (
              <Th key={column.id}>{t(`${source}.${column.accessorKey}`)}</Th>
            ))}
            {hasButton && <Th />}
            {hasMenu && <Th />}
          </Tr>
        </Thead>
        <Tbody>
          {tableData.map(row => (
            <React.Fragment key={row.id}>
              <Tr data-cy='datatable_row'>
                {TableColumns[source].map(col => (
                  <Td key={`${source}_${row.id}_${col.accessorKey}`}>
                    {row[col.accessorKey]}
                  </Td>
                ))}
                {hasButton && (
                  <Td>
                    <Button onClick={onButtonClick}>{t(buttonLabelKey)}</Button>
                  </Td>
                )}
                {hasMenu && (
                  <Td>
                    <MenuCell
                      row={row}
                      expandable={expandable}
                      editable={editable}
                      onEditClick={handleEditClick}
                      destroyable={destroyable}
                      handleDestroyClick={handleDestroyClick}
                    />
                  </Td>
                )}
              </Tr>
              {/* TODO : Handle this when we get to decision trees */}
              {row.isExpanded && <ExpandedRow row={row} />}
            </React.Fragment>
          ))}
        </Tbody>
      </Table>
      <Pagination setTableState={setTableState} tableState={tableState} />
    </Box>
  )
}

export default DataTable
