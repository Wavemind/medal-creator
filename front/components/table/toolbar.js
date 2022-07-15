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
} from "@chakra-ui/react";

/**
 * The internal imports
 */
import { FilterIcon, SearchIcon, SortIcon } from "../../assets/icons";

const Toolbar = () => {
  const handleFilter = () => {
    console.log("filter");
  };

  const handleSort = () => {
    console.log("sort");
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
      <HStack justify="space-between" width="15%">
        <Button
          variant="ghost"
          leftIcon={<FilterIcon boxSize={6} />}
          onClick={handleFilter}
        >
          Filter
        </Button>
        <Button
          variant="ghost"
          leftIcon={<SortIcon boxSize={6} />}
          onClick={handleSort}
        >
          Sort
        </Button>
      </HStack>
    </Flex>
  );
};

export default Toolbar;
