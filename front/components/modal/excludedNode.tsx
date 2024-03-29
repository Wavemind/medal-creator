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
import { useProject } from '@/lib/hooks/useProject'
import { useAppRouter } from '@/lib/hooks/useAppRouter'
import type {
  Drug,
  ExcludedNodeComponent,
  Management,
  Option,
  Paginated,
  Unpacked,
} from '@/types'

const ExcludedNode: ExcludedNodeComponent = ({
  index,
  exclusion,
  setNewExclusions,
  nodeType,
  lazyNodesQuery,
}) => {
  const { t } = useTranslation('datatable')

  const [searchTerm, setSearchTerm] = useState('')

  const { projectLanguage } = useProject()

  const {
    query: { projectId },
  } = useAppRouter()

  const [getNodes, { data: nodes, isFetching: isGetNodesFetching }] =
    lazyNodesQuery()

  useEffect(() => {
    if (searchTerm.length > 0) {
      getNodes({
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
   * Builds options from the drugs/managements obtained from the api
   */
  const nodeOptions = useMemo(() => {
    if (nodes && nodes.edges.length > 0) {
      return nodes.edges.map(
        (edge: Unpacked<Paginated<Drug | Management>['edges']>) => ({
          label: extractTranslation(
            edge.node.labelTranslations,
            projectLanguage
          ),
          value: edge.node.id,
        })
      )
    }

    return []
  }, [nodes])

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
          noOptionsMessage={() => t('noOptions', { ns: 'common' })}
          styles={{
            menuPortal: base => ({ ...base, zIndex: 9999 }),
          }}
          components={{
            DropdownIndicator: () => null,
            IndicatorSeparator: () => null,
          }}
          placeholder={t(`${nodeType}s.placeholder`)}
          onChange={(option: SingleValue<Option>) =>
            handleSelect(option, index)
          }
          onInputChange={value => debouncedChangeHandler(value)}
          options={nodeOptions}
          isLoading={isGetNodesFetching}
          menuIsOpen={searchTerm.length > 0}
          closeMenuOnSelect
        />
      </Td>
      <Td w='10%' flex={0}>
        <IconButton
          variant='ghost'
          data-testid='delete-exclusion'
          onClick={() => handleRemove(index)}
          icon={<DeleteIcon />}
          aria-label={t('delete', { ns: 'datatable' })}
        />
      </Td>
    </Tr>
  )
}

export default ExcludedNode
