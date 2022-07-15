/**
 * The external imports
 */
import React, { useMemo } from "react";
import {
  useReactTable,
  flexRender,
  getCoreRowModel,
} from "@tanstack/react-table";
import { Table, Thead, Tbody, Tr, Th, Td, Button } from "@chakra-ui/react";

/**
 * The internal imports
 */
import Toolbar from "./toolbar";
import { TableColumns } from "../../config/tableColumns";
import { ShowMoreIcon, OverflowMenuIcon } from "../../assets/icons";

const DataTable = ({
  source,
  data,
  expandable = false,
  hasMenu = true,
  hasButton = true,
}) => {
  const tableColumns = useMemo(() => {
    let columns = TableColumns[source].map(col => ({
      ...col,
      cell: info => info.getValue(),
    }));

    if (expandable) {
      columns = [
        {
          accessorKey: "showMore",
          header: "",
          cell: _info => (
            <Button variant="ghost" onClick={() => console.log("show more")}>
              <ShowMoreIcon boxSize={6} />
            </Button>
          ),
        },
        ...columns,
      ];
    }

    if (hasButton) {
      columns = [
        ...columns,
        {
          accessorKey: "openDecisionTree",
          header: () => {},
          cell: _info => (
            <Button width="auto" onClick={() => console.log("clicked")}>
              Open Decision Tree
            </Button>
          ),
        },
      ];
    }

    if (hasMenu) {
      columns = [
        ...columns,
        {
          accessorKey: "menu",
          header: () => {},
          cell: _info => (
            <Button variant="ghost" onClick={() => console.log("menu clicked")}>
              <OverflowMenuIcon boxSize={6} />
            </Button>
          ),
        },
      ];
    }

    return columns;
  }, [source]);

  const { getHeaderGroups, getRowModel } = useReactTable({
    columns: tableColumns,
    data,
    getCoreRowModel: getCoreRowModel(),
  });

  return (
    <div
      style={{
        marginLeft: 100,
        marginRight: 100,
        marginTop: 100,
        borderRadius: 10,
        boxShadow: "0px 0px 3px grey",
      }}
    >
      <Toolbar />
      <Table>
        <Thead>
          {getHeaderGroups().map(headerGroup => (
            <Tr key={headerGroup.id}>
              {headerGroup.headers.map(header => (
                <Th key={header.id} textTransform="none">
                  {header.isPlaceholder
                    ? null
                    : flexRender(
                        header.column.columnDef.header,
                        header.getContext()
                      )}
                </Th>
              ))}
            </Tr>
          ))}
        </Thead>
        <Tbody>
          {getRowModel().rows.map(row => (
            <Tr key={row.id}>
              {row.getVisibleCells().map(cell => (
                <Td key={cell.id}>
                  {flexRender(cell.column.columnDef.cell, cell.getContext())}
                </Td>
              ))}
            </Tr>
          ))}
        </Tbody>
      </Table>
    </div>
  );
};

export default DataTable;
