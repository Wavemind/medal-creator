/**
 * The external imports
 */
import React from "react";
import { useTranslation } from "next-i18next";
import {
  HStack,
  Button,
  Text,
  Select,
  NumberInput,
  NumberInputField,
  NumberInputStepper,
  NumberIncrementStepper,
  NumberDecrementStepper,
} from "@chakra-ui/react";

const Pagination = ({ table }) => {
  const { t } = useTranslation("datatable");

  const {
    setPageIndex,
    setPageSize,
    getPageCount,
    previousPage,
    getCanPreviousPage,
    nextPage,
    getCanNextPage,
    getState,
  } = table;

  return (
    <HStack spacing={4} marginLeft={5}>
      <Button
        flex={0}
        onClick={() => setPageIndex(0)}
        disabled={!getCanPreviousPage()}
        variant="ghost"
      >
        {"<<"}
      </Button>
      <Button
        flex={0}
        onClick={previousPage}
        disabled={!getCanPreviousPage()}
        variant="ghost"
      >
        {t("prev")}
      </Button>
      <HStack className="flex items-center gap-1">
        <Text>{t('page')}</Text>
        <HStack>
          <NumberInput
            width={20}
            marginTop={5}
            marginBottom={5}
            defaultValue={getState().pagination.pageIndex + 1}
            min={1}
            max={table.getPageCount()}
            onBlur={e => {
              const newPage = e.target.value ? Number(e.target.value) - 1 : 0;
              setPageIndex(newPage);
            }}
            isDisabled={getPageCount() === 1}
          >
            <NumberInputField />
            <NumberInputStepper>
              <NumberIncrementStepper
                onClick={() => {
                  setPageIndex(getState().pagination.pageIndex + 1);
                }}
              />
              <NumberDecrementStepper
                onClick={() => {
                  setPageIndex(getState().pagination.pageIndex - 1);
                }}
              />
            </NumberInputStepper>
          </NumberInput>
          <Text>{` of ${table.getPageCount()}`}</Text>
        </HStack>
      </HStack>
      <Button
        flex={0}
        onClick={nextPage}
        disabled={!getCanNextPage()}
        variant="ghost"
      >
        {t("next")}
      </Button>
      <Button
        flex={0}
        onClick={() => setPageIndex(getPageCount() - 1)}
        disabled={!getCanNextPage()}
        variant="ghost"
      >
        {">>"}
      </Button>
      <HStack>
        <Text>{t('show')}</Text>
        <Select
          flex={1}
          value={getState().pagination.pageSize}
          onChange={e => {
            setPageSize(Number(e.target.value));
          }}
        >
          {[1, 2, 3, 4, 5].map(pageSize => (
            <option key={pageSize} value={pageSize}>
              {pageSize}
            </option>
          ))}
        </Select>
      </HStack>
    </HStack>
  );
};

export default Pagination;
