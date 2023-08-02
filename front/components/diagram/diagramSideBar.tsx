/**
 * The external imports
 */
import { type ChangeEvent, useEffect, useState, useMemo, FC } from 'react'
import {
  Spinner,
  VStack,
  useTheme,
  Text,
  Button,
  FocusLock,
  Popover,
  PopoverArrow,
  PopoverCloseButton,
  PopoverContent,
  PopoverTrigger,
  Box,
  PopoverHeader,
  Checkbox,
  HStack,
} from '@chakra-ui/react'
import {
  type MultiValue,
  Select,
  chakraComponents,
  OptionProps,
} from 'chakra-react-select'
import { useTranslation } from 'next-i18next'

/**
 * The internal imports
 */
import { AvailableNode, Search } from '@/components'
import { useLazyGetAvailableNodesQuery } from '@/lib/api/modules'
import { useAppRouter } from '@/lib/hooks'
import { FilterIcon } from '@/assets/icons'
import { VariableService } from '@/lib/services'
import type { DiagramTypeComponent, Option } from '@/types'

// TODO : Validate functionality with Quentin & Colin and if ok remove this
// const InputOption: FC<OptionProps<Option>> = ({
//   isSelected,
//   children,
//   innerProps,
//   ...rest
// }) => {
//   return (
//     <chakraComponents.Option
//       isSelected={isSelected}
//       innerProps={{
//         ...innerProps,
//         style: {
//           backgroundColor: 'transparent',
//           color: 'inherit',
//           '&:hover': {
//             backgroundColor: 'pink',
//           },
//         },
//       }}
//       {...rest}
//     >
//       <HStack>
//         <Checkbox isChecked={isSelected} />
//         <Text>{children}</Text>
//       </HStack>
//     </chakraComponents.Option>
//   )
// }

const DiagramSideBar: DiagramTypeComponent = ({ diagramType }) => {
  const { t } = useTranslation('datatable')

  const { colors } = useTheme()
  const {
    query: { instanceableId },
  } = useAppRouter()
  const [searchTerm, setSearchTerm] = useState('')
  const [isNeonatChecked, setIsNeonatChecked] = useState<boolean | null>(null)
  const [selectedCategories, setSelectedCategories] = useState<
    MultiValue<Option>
  >([])
  const [loading, setLoading] = useState(true)

  const [getAvailableNodes, { data, isSuccess, isFetching }] =
    useLazyGetAvailableNodesQuery()

  useEffect(() => {
    setLoading(true)
    getAvailableNodes({
      instanceableId,
      instanceableType: diagramType,
      searchTerm,
    })
  }, [searchTerm])

  useEffect(() => {
    if (isSuccess && !isFetching) {
      setLoading(false)
    }
  }, [isSuccess, isFetching])

  /**
   * Updates the search term and resets the pagination
   * @param {*} e Event object
   */
  const updateSearchTerm = (e: ChangeEvent<HTMLInputElement>): void => {
    setSearchTerm(e.target.value)
  }

  /**
   * Resets the search term to an empty string
   */
  const resetSearchTerm = () => {
    setSearchTerm('')
  }

  const categoriesOptions: Option[] = useMemo(
    () =>
      VariableService.categories.map(category => ({
        value: category,
        label: t(`categories.${category}.label`, {
          ns: 'variables',
          defaultValue: '',
        }),
      })),
    []
  )

  const handleChange = (event: ChangeEvent<HTMLInputElement>) => {
    setIsNeonatChecked(event.target.checked)
  }

  const handleResetIsNeonat = () => {
    setIsNeonatChecked(null)
  }

  return (
    <VStack
      bg={colors.subMenu}
      boxShadow='-4px 0px 8px rgba(45, 45, 45, 0.1)'
      h='100vh'
      w={350}
    >
      <VStack alignItems='flex-start' px={4} w='full' mt={4} spacing={4}>
        <Search
          updateSearchTerm={updateSearchTerm}
          resetSearchTerm={resetSearchTerm}
        />
        <Popover placement='right' isLazy>
          <PopoverTrigger>
            <Button variant='ghost'>
              <FilterIcon mr={2} />
              {t('filter', { ns: 'datatable' })}
            </Button>
          </PopoverTrigger>
          <PopoverContent minW='600px'>
            <FocusLock restoreFocus persistentFocus={false}>
              <PopoverArrow />
              <PopoverCloseButton />
              <PopoverHeader>{t('filter', { ns: 'datatable' })}</PopoverHeader>
              <VStack w='full' spacing={2} p={2}>
                <Box w='full'>
                  <Select<Option, true>
                    isMulti
                    options={categoriesOptions}
                    closeMenuOnSelect={false}
                    hideSelectedOptions={false}
                    onChange={setSelectedCategories}
                    selectedOptionStyle='check'
                    components={{
                      DropdownIndicator: () => null,
                      IndicatorSeparator: () => null,
                    }}
                  />
                </Box>
                <HStack
                  w='full'
                  justifyContent='space-between'
                  alignItems='center'
                >
                  <Checkbox isChecked={isNeonatChecked} onChange={handleChange}>
                    Is neonat
                  </Checkbox>
                  <Button
                    variant='ghost'
                    color='error'
                    onClick={handleResetIsNeonat}
                  >
                    Reset
                  </Button>
                </HStack>
              </VStack>
            </FocusLock>
          </PopoverContent>
        </Popover>
      </VStack>
      <VStack h='full' mt={4} spacing={4} w='full' overflowY='scroll' p={4}>
        {!loading ? (
          data && data.length > 0 ? (
            data.map(node => <AvailableNode key={node.id} node={node} />)
          ) : (
            <Text>{t('noData')}</Text>
          )
        ) : (
          <Spinner />
        )}
      </VStack>
    </VStack>
  )
}

export default DiagramSideBar
