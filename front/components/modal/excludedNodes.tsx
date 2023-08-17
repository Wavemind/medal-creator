/**
 * The external imports
 */
import { useContext, useEffect, useMemo, useState } from 'react'
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
import { useGetProjectQuery } from '@/lib/api/modules/enhanced/project.enhanced'
import ExcludedNode from '@/components/modal/excludedNode'
import ErrorMessage from '@/components/errorMessage'
import { useToast } from '@/lib/hooks'
import { ModalContext } from '@/lib/contexts'
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
  const { close } = useContext(ModalContext)

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
  const { data: project } = useGetProjectQuery({
    id: projectId,
  })

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