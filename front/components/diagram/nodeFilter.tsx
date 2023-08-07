/**
 * The external imports
 */
import { useMemo, useState } from 'react'
import {
  VStack,
  Text,
  Button,
  FocusLock,
  Popover,
  PopoverArrow,
  PopoverCloseButton,
  PopoverContent,
  PopoverTrigger,
  Box,
  HStack,
  useDisclosure,
} from '@chakra-ui/react'
import { Select, SingleValue } from 'chakra-react-select'
import { useTranslation } from 'next-i18next'

import { FilterIcon } from '@/assets/icons'
import { VariableService } from '@/lib/services'
import { usePaginationFilter } from '@/lib/hooks'
import type {
  FilterKey,
  NodeFilterComponent,
  Option,
  UpdateFilterData,
} from '@/types'

const NodeFilter: NodeFilterComponent = () => {
  const { t } = useTranslation('common')

  const { onOpen, onClose, isOpen } = useDisclosure()
  const { updateFilter, resetFilter, filterState } = usePaginationFilter()

  const { categories, isNeonat } = useMemo(
    () => filterState,
    [filterState.categories, filterState.isNeonat]
  )

  const [selectedNeonat, setSelectedNeonat] =
    useState<SingleValue<Option>>(null)

  /**
   * Reformats the categories list for the select component
   */
  // TODO WAIT NEW ENUM
  const categoriesOptions: Option[] = useMemo(
    () =>
      VariableService.categories.map(category => ({
        value: category,
        label: t(`categories.${category}.label`, {
          ns: 'variables',
          defaultValue: '',
        }),
      })),
    [t]
  )

  /**
   * Boolean to indicate whether list is filtered or not
   */
  const isFiltered: boolean = useMemo(
    () => categories.length > 0 || !!isNeonat,
    [isNeonat, categories]
  )

  /**
   * Resets all filters
   */
  const handleReset = (): void => {
    setSelectedNeonat(null)
    resetFilter()
    onClose()
  }

  const convertSingleValueToBooleanOrNull = (
    data: SingleValue<Option>
  ): boolean | null => {
    if (data && data.value) {
      return data.value === 'true'
    }
    return null
  }

  // TODO: Fix it
  const handleUpdateFilter = <KeyToUpdate extends FilterKey>(
    key: KeyToUpdate,
    data: UpdateFilterData<KeyToUpdate>
  ): void => {
    if (key === 'isNeonat') {
      setSelectedNeonat(data)
      updateFilter('isNeonat', convertSingleValueToBooleanOrNull(data))
    } else {
      updateFilter(key, data)
    }
  }

  return (
    <Popover
      isLazy
      placement='right'
      isOpen={isOpen}
      onOpen={onOpen}
      onClose={onClose}
    >
      <PopoverTrigger>
        <Button
          variant='outline'
          w='full'
          bg={isOpen || isFiltered ? 'primary' : 'inherit'}
          color={isOpen || isFiltered ? 'white' : 'inherit'}
        >
          <FilterIcon mr={2} />
          {isFiltered
            ? t('filtered', { ns: 'datatable' })
            : t('addFilter', { ns: 'datatable' })}
        </Button>
      </PopoverTrigger>
      <PopoverContent minW='600px' borderRadius='15px'>
        <FocusLock restoreFocus persistentFocus={false}>
          <PopoverArrow />
          <PopoverCloseButton />
          <VStack w='full' spacing={4} p={4}>
            <Box w='full'>
              <Text mb={2} fontWeight='bold'>
                {t('type', { ns: 'variables' })}
              </Text>
              <Select<Option, true>
                isMulti
                value={categories}
                options={categoriesOptions}
                closeMenuOnSelect={false}
                hideSelectedOptions={false}
                onChange={data => handleUpdateFilter('categories', data)}
                selectedOptionStyle='check'
                variant='outline'
                useBasicStyles
              />
            </Box>
            <HStack
              w='full'
              justifyContent='space-between'
              alignItems='center'
              spacing={4}
            >
              <Box flex={1}>
                <Text mb={2} fontWeight='bold'>
                  {t('isNeonat', { ns: 'variables' })}
                </Text>
                <Select<Option>
                  variant='outline'
                  useBasicStyles
                  isClearable
                  onChange={data => handleUpdateFilter('isNeonat', data)}
                  value={selectedNeonat}
                  options={[
                    { label: t('yes'), value: 'true' },
                    { label: t('no'), value: 'false' },
                  ]}
                />
              </Box>
            </HStack>
          </VStack>
          <HStack w='full' justifyContent='space-between' p={4}>
            <Button variant='outline' onClick={handleReset}>
              {t('reset')}
            </Button>
            <Button onClick={onClose}>{t('save')}</Button>
          </HStack>
        </FocusLock>
      </PopoverContent>
    </Popover>
  )
}

export default NodeFilter
