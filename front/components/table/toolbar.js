/**
 * The external imports
 */
import React, { useMemo, useState } from "react";
import {
  Flex,
  Input,
  InputGroup,
  InputLeftElement,
  HStack,
  Button,
  Menu,
  MenuButton,
  MenuList,
  MenuItem,
  Stack,
} from "@chakra-ui/react";

/**
 * The internal imports
 */
import { FilterIcon, SearchIcon, SortIcon } from "../../assets/icons";
import { TableColumns } from "../../config/tableColumns";

const Toolbar = ({ source, sortable, filterable }) => {
  const handleFilter = key => {
    console.log(`${key} filter`);
  };

  const handleSort = key => {
    console.log(`${key} sort`);
  };

  const handleSearch = e => {
    console.log("search", e.target.value);
  };

  const dataColumns = useMemo(() => {
    return TableColumns[source].map(col => ({
      key: col.accessorKey,
      label: col.header,
    }));
  }, [source]);

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
      <Stack justify="space-between" width="15%" direction="row-reverse">
        {sortable && (
          <Menu>
            <MenuButton
              as={Button}
              leftIcon={<SortIcon boxSize={6} />}
              variant="ghost"
            >
              Sort
            </MenuButton>
            <MenuList>
              {dataColumns.map(col => (
                <MenuItem key={col.key} onClick={() => handleSort(col.key)}>
                  {col.label}
                </MenuItem>
              ))}
            </MenuList>
          </Menu>
        )}
        {filterable && (
          <Menu>
            <MenuButton
              as={Button}
              leftIcon={<FilterIcon boxSize={6} />}
              variant="ghost"
            >
              Filter
            </MenuButton>
            <MenuList>
              {dataColumns.map(col => (
                <MenuItem key={col.key} onClick={() => handleFilter(col.key)}>
                  {col.label}
                </MenuItem>
              ))}
            </MenuList>
          </Menu>
        )}
      </Stack>
    </Flex>
  );
};

export default Toolbar;
