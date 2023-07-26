/**
 * The external imports
 */
import { ChangeEvent, useState } from 'react'
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
  Select,
  HStack,
  IconButton,
} from '@chakra-ui/react'
import { useTranslation } from 'next-i18next'

/**
 * The internal imports
 */
import { DeleteIcon } from '@/assets/icons'
import { extractTranslation } from '@/lib/utils'
import { useGetProjectQuery } from '@/lib/api/modules'
import type { ExcludedDrugsComponent } from '@/types'

const ExcludedDrugs: ExcludedDrugsComponent = ({ projectId, drug }) => {
  const { t } = useTranslation('drugs')

  const [newExclusions, setNewExclusions] = useState<Array<string | undefined>>(
    [undefined]
  )

  const { data: project } = useGetProjectQuery({
    id: projectId,
  })

  // Adds an exclusion to the end of the list
  const handleAddExclusion = (): void => {
    setNewExclusions(prev => [...prev, undefined])
  }

  // Removes the exclusion using the selected index
  const handleRemove = (index: number): void => {
    setNewExclusions(prev => prev.filter((_e, i) => i !== index))
  }

  // Updates the exclusion list with the id of the excluded drug
  const handleSelect = (
    event: ChangeEvent<HTMLSelectElement>,
    index: number
  ): void => {
    setNewExclusions(prev =>
      prev.map((exclusion, i) => (i === index ? event.target.value : exclusion))
    )
  }

  // Sends the exclusion list to the api
  const handleSave = () => {
    console.log('send the exclusions to the api')
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
                <Th />
                <Th />
              </Tr>
            </Thead>
            <Tbody>
              {newExclusions.map((exclusion, index) => (
                <Tr key={index}>
                  <Td>
                    {extractTranslation(
                      drug?.labelTranslations,
                      project?.language.code
                    )}
                  </Td>
                  <Td>{t('excludes')}</Td>
                  <Td textAlign='right'>
                    <Select
                      value={exclusion}
                      placeholder={t('title')}
                      onChange={event => handleSelect(event, index)}
                    >
                      <option value={1}>Dafalgan</option>
                      <option value={2}>Ibu</option>
                      <option value={3}>Tramal</option>
                    </Select>
                  </Td>
                  <Td>
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
