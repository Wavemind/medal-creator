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
import { ExcludedNode } from '@/components'
import { useToast } from '@/lib/hooks'
import { ModalContext } from '@/lib/contexts'
import { extractTranslation } from '@/lib/utils'
import type { ExcludedNodesComponent, Option } from '@/types'

const ExcludedNodes: ExcludedNodesComponent = ({
  projectId,
  nodeId,
  nodeType,
  nodeQuery,
  lazyNodesQuery,
}) => {
  const { t } = useTranslation('datatable')
  const { newToast } = useToast()
  const { close } = useContext(ModalContext)

  const [newExclusions, setNewExclusions] = useState<Array<Option | null>>([
    null,
  ])

  const { data: node } = nodeQuery({ id: nodeId })

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

  /**
   * Adds an exclusion to the end of the list
   */
  const handleAddExclusion = (): void => {
    setNewExclusions(prev => [...prev, null])
  }

  /**
   * Sends the exclusion list to the api
   */
  const handleSave = () => {
    // TODO : What happens if one of the creations fails ?
    const exclusionsToAdd = newExclusions
      // This filter removes all null values before sending to the api
      .filter(exclusion => exclusion)
      .map(exclusion => ({
        nodeType,
        excludingNodeId: nodeId,
        excludedNodeId: exclusion!.value,
      }))

    createNodeExclusions({
      params: exclusionsToAdd,
    })
  }

  // TODO : Improve error management
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
            {t('exclusions.excludes', {
              nodeName: extractTranslation(
                node?.labelTranslations,
                project?.language.code
              ),
            })}
          </Text>
        </Box>
        <TableContainer>
          <Table variant='basic'>
            <Thead>
              <Tr />
            </Thead>
            <Tbody>
              {newExclusions.map((exclusion, index) => (
                <ExcludedNode
                  key={`exclusion_${index}`}
                  index={index}
                  exclusion={exclusion}
                  projectId={projectId}
                  setNewExclusions={setNewExclusions}
                  nodeType={nodeType}
                  lazyNodesQuery={lazyNodesQuery}
                />
              ))}
            </Tbody>
          </Table>
        </TableContainer>
      </Box>
      <HStack w='full' justifyContent='space-between'>
        <Button onClick={handleAddExclusion} variant='outline'>
          {t('add', { ns: 'common' })}
        </Button>
        <Button onClick={handleSave}>{t('save', { ns: 'common' })}</Button>
      </HStack>
    </Box>
  )
}

export default ExcludedNodes
