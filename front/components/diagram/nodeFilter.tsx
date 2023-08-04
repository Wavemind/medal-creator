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

import { FilterIcon } from '@/assets/icons'
import { VariableService } from '@/lib/services'
import type { NodeFilterComponent, Option } from '@/types'

const NodeFilter: NodeFilterComponent = ({
  isNeonat,
  setIsNeonat,
  selectedCategories,
  setSelectedCategories,
}) => {
  const { t } = useTranslation('common')

  const { onOpen, onClose, isOpen } = useDisclosure()

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
    () => selectedCategories.length > 0 || !!isNeonat,
    [selectedCategories, isNeonat]
  )

  /**
   * Resets all filters
   */
  const handleReset = () => {
    setSelectedCategories([])
    setIsNeonat(null)
    onClose()
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
                value={selectedCategories}
                options={categoriesOptions}
                closeMenuOnSelect={false}
                hideSelectedOptions={false}
                onChange={setSelectedCategories}
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
                  onChange={setIsNeonat}
                  value={isNeonat}
                  options={[
                    { label: t('yes'), value: 'Yes' },
                    { label: t('no'), value: 'No' },
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
