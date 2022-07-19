/**
 * The external imports
 */
import React, { useMemo } from "react";
import { useTranslation } from "next-i18next";
import {
  useReactTable,
  flexRender,
  getCoreRowModel,
} from "@tanstack/react-table";
import {
  Table,
  Thead,
  Tbody,
  Tr,
  Th,
  Td,
  Button,
  Menu,
  MenuButton,
  MenuList,
  MenuItem,
  IconButton,
  useTheme,
  Box,
} from "@chakra-ui/react";

/**
 * The internal imports
 */
import Toolbar from "./toolbar";
import { TableColumns } from "../../config/tableColumns";
import {
  ShowMoreIcon,
  OverflowMenuIcon,
  InformationIcon,
  EditIcon,
  DuplicateIcon,
  DeleteIcon,
} from "../../assets/icons";

const DataTable = ({
  source,
  data,
  sortable = true,
  filterable = true,
  expandable = false,
  hasMenu = true,
  hasButton = true,
}) => {
  const { colors } = useTheme();
  const { t } = useTranslation("datatable");

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
            <Box textAlign="right">
              <Menu>
                <MenuButton as={IconButton} variant="ghost">
                  <OverflowMenuIcon boxSize={6} />
                </MenuButton>
                <MenuList>
                  <MenuItem icon={<InformationIcon boxSize={6} />}>
                  {t("details")}
                  </MenuItem>
                  <MenuItem icon={<EditIcon boxSize={6} />}>{t('edit')}</MenuItem>
                  <MenuItem icon={<DuplicateIcon boxSize={6} />}>
                    {t("duplicate")}
                  </MenuItem>
                  <MenuItem
                    icon={<DeleteIcon boxSize={6} color={colors.secondary} />}
                    color={colors.secondary}
                  >
                    {t("delete")}
                  </MenuItem>
                </MenuList>
              </Menu>
            </Box>
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

  const headers = useMemo(() => {
    if (getHeaderGroups) {
      return getHeaderGroups()[0].headers;
    }
    return []
  }, [getHeaderGroups]);

  const rows = useMemo(() => {
    if (getRowModel) {
      return getRowModel().rows;
    }
    return []
  }, [getRowModel])

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
      <Toolbar source={source} sortable={sortable} filterable={filterable} />
      <Table>
        <Thead>
          <Tr>
            {headers.map(header => (
              <Th key={header.id} textTransform="none">
                {flexRender(
                  header.column.columnDef.header,
                  header.getContext()
                )}
              </Th>
            ))}
          </Tr>
        </Thead>
        <Tbody>
          {rows.map(row => (
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
