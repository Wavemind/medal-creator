/**
 * The external imports
 */
import { useMemo } from 'react'
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
import { Select } from 'chakra-react-select'
import { useTranslation } from 'next-i18next'

/**
 * The internal imports
 */
import FilterIcon from '@/assets/icons/Filter'
import DiagramService from '@/lib/services/diagram.service'
import { usePaginationFilter } from '@/lib/hooks'
import type {
  FilterKey,
  DiagramTypeComponent,
  Option,
  UpdateFilterData,
} from '@/types'

const NodeFilter: DiagramTypeComponent = ({ diagramType }) => {
  const { t } = useTranslation('common')

  const { onOpen, onClose, isOpen } = useDisclosure()
  const { updateFilter, resetFilter, filterState } = usePaginationFilter()

  const { selectedCategories, selectedIsNeonat } = useMemo(
    () => filterState,
    [filterState.selectedCategories, filterState.selectedIsNeonat]
  )

  const categoriesOptions: Option[] = useMemo(
    () => DiagramService.categoryFilterOptions(diagramType, t),
    [t]
  )

  const isFiltered: boolean = useMemo(
    () => selectedCategories.length > 0 || !!selectedIsNeonat,
    [selectedIsNeonat, selectedCategories]
  )

  const handleReset = (): void => {
    resetFilter()
    onClose()
  }

  const handleUpdateFilter = <KeyToUpdate extends FilterKey>(
    key: KeyToUpdate,
    data: UpdateFilterData<KeyToUpdate>
  ): void => updateFilter(key, data)

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
                value={selectedCategories}
                options={categoriesOptions}
                closeMenuOnSelect={false}
                hideSelectedOptions={false}
                onChange={data =>
                  handleUpdateFilter('selectedCategories', data)
                }
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
                  onChange={data =>
                    handleUpdateFilter('selectedIsNeonat', data)
                  }
                  value={selectedIsNeonat}
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
