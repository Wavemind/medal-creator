/**
 * The external imports
 */
import { useCallback, useState, useEffect, useMemo } from 'react'
import { Td, Tr, IconButton } from '@chakra-ui/react'
import { useTranslation } from 'next-i18next'
import debounce from 'lodash/debounce'
import { Select, type SingleValue } from 'chakra-react-select'

/**
 * The internal imports
 */
import DeleteIcon from '@/assets/icons/Delete'
import { extractTranslation } from '@/lib/utils/string'
import { useGetProjectQuery, useLazyGetDrugsQuery } from '@/lib/api/modules'
import type { ExcludedDrugComponent, Option } from '@/types'

const ExcludedDrug: ExcludedDrugComponent = ({
  index,
  exclusion,
  projectId,
  setNewExclusions,
}) => {
  const { t } = useTranslation('drugs')

  const [searchTerm, setSearchTerm] = useState('')

  const [getDrugs, { data: drugs, isFetching: isGetDrugsFetching }] =
    useLazyGetDrugsQuery()
  const { data: project } = useGetProjectQuery({ id: projectId })

  useEffect(() => {
    if (searchTerm.length > 0) {
      getDrugs({
        projectId,
        searchTerm,
        first: 5,
      })
    }
  }, [searchTerm])

  /**
   * Removes the exclusion using the selected index
   */
  const handleRemove = (index: number): void => {
    setNewExclusions(prev => prev.filter((_e, i) => i !== index))
  }

  /**
   * Updates the exclusion list with the option of the excluded drug
   */
  const handleSelect = (option: SingleValue<Option>, index: number): void => {
    if (option) {
      setNewExclusions(prev =>
        prev.map((newExclusion, i) => (i === index ? option : newExclusion))
      )
    }
  }

  /**
   * Builds options from the drugs obtained from the api
   */
  const drugOptions = useMemo(() => {
    if (drugs && drugs.edges.length > 0) {
      return drugs.edges.map(edge => {
        return {
          label: extractTranslation(
            edge.node.labelTranslations,
            project?.language.code
          ),
          value: edge.node.id,
        }
      })
    }

    return []
  }, [drugs])

  /**
   * Debounces the search update by 0.3 seconds
   */
  const debouncedChangeHandler = useCallback(debounce(setSearchTerm, 300), [])

  return (
    <Tr key={index}>
      <Td>
        <Select<Option>
          value={exclusion}
          openMenuOnClick={false}
          openMenuOnFocus={false}
          menuPortalTarget={document.body}
          styles={{
            menuPortal: base => ({ ...base, zIndex: 9999 }),
          }}
          components={{
            DropdownIndicator: () => null,
            IndicatorSeparator: () => null,
          }}
          placeholder={t('title')}
          onChange={(option: SingleValue<Option>) =>
            handleSelect(option, index)
          }
          onInputChange={value => debouncedChangeHandler(value)}
          options={drugOptions}
          isLoading={isGetDrugsFetching}
          menuIsOpen={searchTerm.length > 0}
          closeMenuOnSelect
        />
      </Td>
      <Td w='10%' flex={0}>
        <IconButton
          variant='ghost'
          onClick={() => handleRemove(index)}
          icon={<DeleteIcon />}
          aria-label={t('delete', { ns: 'datatable' })}
        />
      </Td>
    </Tr>
  )
}

export default ExcludedDrug
