/**
 * The external imports
 */
import { useEffect, useMemo, useState } from 'react'
import {
  Box,
  Table,
  TableContainer,
  Tbody,
  Thead,
  Tr,
  Text,
  HStack,
  Center,
  Button,
} from '@chakra-ui/react'
import { useTranslation } from 'next-i18next'

/**
 * The internal imports
 */
import { useCreateNodeExclusionsMutation } from '@/lib/api/modules/enhanced/nodeExclusion.enhanced'
import ExcludedNode from '@/components/modal/excludedNode'
import ErrorMessage from '@/components/errorMessage'
import { useModal, useProject, useToast } from '@/lib/hooks'
import { extractTranslation } from '@/lib/utils/string'
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
  const { close } = useModal()
  const { projectLanguage } = useProject()

  const [newExclusions, setNewExclusions] = useState<Array<Option | null>>([
    null,
  ])

  const { data: node } = nodeQuery({ id: nodeId })

  const [
    createNodeExclusions,
    {
      isError: isCreateNodeExclusionsError,
      error: createNodeExclusionsError,
      isSuccess: isCreateNodeExclusionsSuccess,
    },
  ] = useCreateNodeExclusionsMutation()

  const hasExclusions = useMemo(
    () => newExclusions.filter(exclusion => exclusion).length > 0,
    [newExclusions]
  )

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

  useEffect(() => {
    if (isCreateNodeExclusionsSuccess) {
      newToast({
        message: t('notifications.saveSuccess', { ns: 'common' }),
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
                projectLanguage
              ),
            })}
          </Text>
        </Box>
        {isCreateNodeExclusionsError && (
          <Center my={4}>
            <ErrorMessage
              error={createNodeExclusionsError}
              errorKey='excluded_node_id'
            />
          </Center>
        )}
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
        <Button onClick={handleSave} isDisabled={!hasExclusions}>
          {t('save', { ns: 'common' })}
        </Button>
      </HStack>
    </Box>
  )
}

export default ExcludedNodes
