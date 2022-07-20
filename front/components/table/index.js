/**
 * The external imports
 */
import React, { useMemo, useState } from "react";
import { useTranslation } from "next-i18next";
import {
  useReactTable,
  flexRender,
  getCoreRowModel,
  getSortedRowModel,
  getPaginationRowModel,
} from "@tanstack/react-table";
import {
  Table,
  Thead,
  Tbody,
  Tr,
  Th,
  Td,
  Box,
  HStack,
  Button,
  Input,
  Text,
  Select,
} from "@chakra-ui/react";

/**
 * The internal imports
 */
import Toolbar from "./toolbar";
import Pagination from "./pagination";
import { buildTableColumns } from "../../utils/buildTableColumns";

const DataTable = ({
  source,
  data,
  sortable = true,
  filterable = true,
  expandable = false,
  hasMenu = true,
  hasButton = true,
}) => {
  const { t } = useTranslation("datatable");

  const [sorting, setSorting] = useState([]);

  const tableColumns = useMemo(
    () => buildTableColumns(source, expandable, hasButton, hasMenu, t),
    [source]
  );

  const table = useReactTable({
    data,
    columns: tableColumns,
    getCoreRowModel: getCoreRowModel(),
    initialState: {
      pagination: {
        pageSize: 2,
      }
    },
    state: {
      sorting,
    },
    onSortingChange: setSorting,
    getSortedRowModel: getSortedRowModel(),
    getPaginationRowModel: getPaginationRowModel(),
    debugTable: true,
  });

  const headers = useMemo(() => {
    if (table.getHeaderGroups) {
      return table.getHeaderGroups()[0].headers;
    }
    return [];
  }, [table.getHeaderGroups]);

  return (
    <Box
      style={{
        margin: 100,
        borderRadius: 10,
        boxShadow: "0px 0px 3px grey",
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
                fontWeight={header.column.getIsSorted() ? "bold" : "normal"}
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
            <Tr key={row.id}>
              {row.getVisibleCells().map((cell, index) => (
                <Td key={cell.id} fontWeight={index === 0 ? "900" : "normal"}>
                  {flexRender(cell.column.columnDef.cell, cell.getContext())}
                </Td>
              ))}
            </Tr>
          ))}
        </Tbody>
      </Table>
      <Pagination table={table} />
    </Box>
  );
};

export default DataTable;
