/**
 * The external imports
 */
import { Tr, Td, Table, Thead, Th, Tbody, useTheme } from '@chakra-ui/react'

const ExpandedRow = ({ row }) => {
  const { colors } = useTheme()

  /* TODO : Handle this when we get to decision trees */
  return (
    <Tr>
      <Td
        colSpan={row.length}
        paddingBottom={0}
        paddingLeft={100}
        paddingRight={0}
      >
        <Table>
          <Thead>
            <Tr>
              {row.subRows.headers.map(header => (
                <Th key={header.id} textTransform='none'>
                  {row.header}
                </Th>
              ))}
            </Tr>
          </Thead>
          <Tbody backgroundColor={colors.third}>
            {row.subRows.map(nestedRow => (
              <Tr key={nestedRow.id}>
                {nestedRow.getVisibleCells().map(cell => (
                  <Td key={cell.id}>{row.value}</Td>
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
