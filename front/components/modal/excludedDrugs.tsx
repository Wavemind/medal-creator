/**
 * The external imports
 */
import { useState } from 'react'
import {
  Box,
  Button,
  Table,
  TableContainer,
  Tbody,
  Td,
  Th,
  Thead,
  Tr,
  Text,
  HStack,
  IconButton,
} from '@chakra-ui/react'
import { useTranslation } from 'next-i18next'

/**
 * The internal imports
 */
import { Select } from 'chakra-react-select'
import { DeleteIcon } from '@/assets/icons'
import { extractTranslation } from '@/lib/utils'
import {
  useCreateNodeExclusionsMutation,
  useGetProjectQuery,
} from '@/lib/api/modules'
import type { ExcludedDrugsComponent, Option } from '@/types'

const ExcludedDrugs: ExcludedDrugsComponent = ({ projectId, drug }) => {
  const { t } = useTranslation('drugs')

  const [newExclusions, setNewExclusions] = useState([{ label: '', value: '' }])

  const [createNodeExclusions, { isError: isCreateNodeExclusionsError }] =
    useCreateNodeExclusionsMutation()
  const { data: project } = useGetProjectQuery({
    id: projectId,
  })

  // Adds an exclusion to the end of the list
  const handleAddExclusion = (): void => {
    setNewExclusions(prev => [...prev, { label: '', value: '' }])
  }

  // Removes the exclusion using the selected index
  const handleRemove = (index: number): void => {
    setNewExclusions(prev => prev.filter((_e, i) => i !== index))
  }

  // Updates the exclusion list with the id of the excluded drug
  const handleSelect = (
    option: { label: string; value: string },
    index: number
  ): void => {
    console.log(option)
    setNewExclusions(prev =>
      prev.map((exclusion, i) => (i === index ? option : exclusion))
    )
  }

  // Sends the exclusion list to the api
  const handleSave = () => {
    const exclusionsToAdd = newExclusions.map(exclusion => ({
      nodeType: 'drug',
      excludingNodeId: drug.id,
      excludedNodeId: exclusion.value,
    }))

    createNodeExclusions({
      params: exclusionsToAdd,
    })
  }

  return (
    <Box>
      <Box
        boxShadow='0px 0px 4px rgba(0, 0, 0, 0.15)'
        borderColor='sidebar'
        borderRadius='lg'
        my={5}
      >
        <Box p={4}>
          <Text fontWeight='bold' fontSize='lg'>
            {t('drugExclusion')}
          </Text>
        </Box>
        <TableContainer>
          <Table>
            <Thead>
              <Tr>
                <Th>{t('drugName')}</Th>
              </Tr>
            </Thead>
            <Tbody>
              {newExclusions.map((exclusion, index) => (
                <Tr key={index}>
                  <Td w='40%'>
                    {extractTranslation(
                      drug?.labelTranslations,
                      project?.language.code
                    )}
                  </Td>
                  <Td w='10%'>{t('excludes')}</Td>
                  <Td px={0}>
                    <Select
                      getOptionLabel={option => option.label}
                      getOptionValue={option => option.value}
                      value={exclusion}
                      openMenuOnClick={false}
                      openMenuOnFocus={false}
                      menuPortalTarget={document.body}
                      styles={{
                        menuPortal: base => ({ ...base, zIndex: 9999 }),
                      }}
                      placeholder={t('title')}
                      onChange={(option: Option) => handleSelect(option, index)}
                      options={[
                        {
                          label: 'I am red',
                          value: 'i-am-red',
                        },
                        {
                          label:
                            'I fallback to purple and i have a longer text',
                          value: 'i-am-purple',
                        },
                      ]}
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
              ))}
            </Tbody>
          </Table>
        </TableContainer>
      </Box>
      <HStack w='full' justifyContent='space-between'>
        <Button onClick={handleAddExclusion}>
          {t('addExclusion', { ns: 'datatable' })}
        </Button>
        <Button onClick={handleSave}>{t('save', { ns: 'common' })}</Button>
      </HStack>
    </Box>
  )
}

export default ExcludedDrugs
