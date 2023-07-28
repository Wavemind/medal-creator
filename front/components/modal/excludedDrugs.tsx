/**
 * The external imports
 */
import { useContext, useEffect, useState } from 'react'
import {
  Box,
  Button,
  Table,
  TableContainer,
  Tbody,
  Thead,
  Tr,
  Text,
  HStack,
} from '@chakra-ui/react'
import { useTranslation } from 'next-i18next'

/**
 * The internal imports
 */
import {
  useCreateNodeExclusionsMutation,
  useGetProjectQuery,
} from '@/lib/api/modules'
import { ExcludedDrug } from '@/components'
import { useToast } from '@/lib/hooks'
import { ModalContext } from '@/lib/contexts'
import type { ExcludedDrugsComponent, Option } from '@/types'
import { extractTranslation } from '@/lib/utils'

const ExcludedDrugs: ExcludedDrugsComponent = ({ projectId, drug }) => {
  const { t } = useTranslation('drugs')
  const { newToast } = useToast()
  const { close } = useContext(ModalContext)

  const [newExclusions, setNewExclusions] = useState<Array<Option | null>>([
    null,
  ])

  const [
    createNodeExclusions,
    {
      isError: isCreateNodeExclusionsError,
      isSuccess: isCreateNodeExclusionsSuccess,
    },
  ] = useCreateNodeExclusionsMutation()
  const { data: project } = useGetProjectQuery({
    id: projectId,
  })

  // Adds an exclusion to the end of the list
  const handleAddExclusion = (): void => {
    setNewExclusions(prev => [...prev, null])
  }

  // Sends the exclusion list to the api
  const handleSave = () => {
    const exclusionsToAdd = newExclusions
      .filter(exclusion => exclusion)
      .map(exclusion => ({
        nodeType: 'drug',
        excludingNodeId: drug.id,
        excludedNodeId: exclusion!.value,
      }))

    createNodeExclusions({
      params: exclusionsToAdd,
    })
  }

  useEffect(() => {
    if (isCreateNodeExclusionsError) {
      newToast({
        message: t('errorBoundary.generalError', { ns: 'common' }),
        status: 'error',
      })
    }
  }, [isCreateNodeExclusionsError])

  useEffect(() => {
    if (isCreateNodeExclusionsSuccess) {
      newToast({
        message: t('notifications.createSuccess', { ns: 'common' }),
        status: 'success',
      })
      close()
    }
  }, [isCreateNodeExclusionsSuccess])

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
            {t('drugExcludes', {
              drugName: extractTranslation(
                drug?.labelTranslations,
                project?.language.code
              ),
            })}
          </Text>
        </Box>
        <TableContainer>
          <Table>
            <Thead>
              <Tr />
            </Thead>
            <Tbody>
              {newExclusions.map((exclusion, index) => (
                <ExcludedDrug
                  index={index}
                  exclusion={exclusion}
                  projectId={projectId}
                  setNewExclusions={setNewExclusions}
                />
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
