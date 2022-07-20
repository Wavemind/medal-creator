/**
 * The external imports
 */
import React from "react";
import { Tr, Td, Text, VStack } from "@chakra-ui/react";
import { flexRender } from "@tanstack/react-table";

const TableRow = ({ row }) => {
  return (
    <Tr key={row.id}>
      {row.getVisibleCells().map((cell, index) => (
        <Td key={cell.id} fontWeight={index === 0 ? "900" : "normal"}>
          {flexRender(cell.column.columnDef.cell, cell.getContext())}
        </Td>
      ))}
      {row.getIsExpanded() && <Text>Hello</Text>}
    </Tr>
  );
};

export default TableRow;
