/**
 * The external imports
 */
import React, { useMemo } from "react";
import {
  Flex,
  Input,
  InputGroup,
  InputLeftElement,
  Button,
  Menu,
  MenuButton,
  MenuList,
  MenuItem,
  HStack,
} from "@chakra-ui/react";
import { useTranslation } from "next-i18next";

/**
 * The internal imports
 */
import {
  FilterIcon,
  SearchIcon,
  SortIcon,
} from "../../assets/icons";

const Toolbar = ({ sortable, filterable, headers }) => {
  const { t } = useTranslation("datatable");

  const filterableColumns = useMemo(
    () => headers.filter(header => header.column.getCanFilter()),
    [headers]
  );

  const sortableColumns = useMemo(
    () => headers.filter(header => header.column.getCanSort()),
    [headers]
  );

  const handleFilter = key => {
    console.log(`${key} filter`);
  };

  const handleSearch = e => {
    console.log("search", e.target.value);
  };

  return (
    <Flex
      align="center"
      justify="space-between"
      paddingLeft={10}
      paddingRight={10}
      marginBottom={5}
      marginTop={5}
    >
      <InputGroup width="30%">
        <InputLeftElement
          pointerEvents="none"
          children={<SearchIcon color="gray.400" />}
        />
        <Input type="text" placeholder="Search XXXX" onChange={handleSearch} />
      </InputGroup>
      <HStack justify="space-between" spacing={10}>
        {filterable && (
          <Menu>
            <MenuButton as={Button} leftIcon={<FilterIcon />} variant="ghost">
              {t("filter")}
            </MenuButton>
            <MenuList>
              {filterableColumns.map(col => (
                <MenuItem key={col.id} onClick={() => handleFilter(col.id)}>
                  {col.column.columnDef.header}
                </MenuItem>
              ))}
            </MenuList>
          </Menu>
        )}
        {sortable && (
          <Menu>
            <MenuButton as={Button} leftIcon={<SortIcon />} variant="ghost">
              {t("sort")}
            </MenuButton>
            <MenuList>
              {sortableColumns.map(col => (
                <MenuItem
                  key={col.id}
                  {...{
                    // Please don't ask me why I have to do this. It doesn't work otherwise :(
                    onClick: col.column.getToggleSortingHandler(),
                  }}
                >
                  {col.column.columnDef.header}
                </MenuItem>
              ))}
            </MenuList>
          </Menu>
        )}
      </HStack>
    </Flex>
  );
};

export default Toolbar;
