/**
 * The external imports
 */
import React from "react";
import {
  Button,
  Menu,
  MenuButton,
  MenuList,
  MenuItem,
  IconButton,
  Box,
  Text,
  HStack,
} from "@chakra-ui/react";

/**
 * The internal imports
 */
import { TableColumns } from "../config/tableColumns";
import {
  ShowMoreIcon,
  OverflowMenuIcon,
  InformationIcon,
  EditIcon,
  DuplicateIcon,
  DeleteIcon,
} from "../assets/icons";
import theme from "../theme/theme";

export const buildTableColumns = (
  source,
  expandable,
  hasButton,
  hasMenu,
  t
) => {
  const columns = TableColumns[source].map(col => ({
    ...col,
    cell: info => info.getValue(),
  }));

  if (hasButton) {
    columns.push({
      accessorKey: "openDecisionTree",
      header: null,
      enableColumnFilter: false,
      enableSorting: false,
      cell: _info => (
        <Button width="auto" onClick={() => console.log("clicked")}>
          Open Decision Tree
        </Button>
      ),
    });
  }

  if (hasMenu) {
    columns.push({
      accessorKey: "menu",
      header: null,
      enableColumnFilter: false,
      enableSorting: false,
      cell: _info => (
        <Box textAlign="right">
          <Menu>
            <MenuButton as={IconButton} variant="ghost">
              <OverflowMenuIcon />
            </MenuButton>
            <MenuList>
              <MenuItem icon={<InformationIcon />}>{t("details")}</MenuItem>
              <MenuItem icon={<EditIcon />}>{t("edit")}</MenuItem>
              <MenuItem icon={<DuplicateIcon />}>{t("duplicate")}</MenuItem>
              <MenuItem
                icon={<DeleteIcon color={theme.colors.secondary} />}
                color={theme.colors.secondary}
              >
                {t("delete")}
              </MenuItem>
            </MenuList>
          </Menu>
          {expandable && (
            <HStack
              justifyContent="end"
              cursor="pointer"
              onClick={() => console.log("expand this", _info)}
            >
              <Text fontSize="xs">Show decision trees</Text>
              <ShowMoreIcon />
            </HStack>
          )}
        </Box>
      ),
    });
  }

  return columns;
};
