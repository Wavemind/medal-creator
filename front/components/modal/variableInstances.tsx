/**
 * The external imports
 */
import {
  TableContainer,
  Table,
  Thead,
  Tr,
  Th,
  Tbody,
  Td,
  Box,
  Text,
  Spinner,
} from '@chakra-ui/react'
import { useTranslation } from 'next-i18next'

/**
 * The internal imports
 */
import DiagramButton from '@/components/diagramButton'
import Card from '@/components/card'
import { useAppRouter } from '@/lib/hooks/useAppRouter'
import { useGetInstancesQuery } from '@/lib/api/modules/enhanced/instance.enhanced'
import DiagramService from '@/lib/services/diagram.service'
import type { GetInstances } from '@/lib/api/modules/enhanced/instance.enhanced'
import type { VariableComponent, Unpacked, DiagramEnum } from '@/types'

const VariableInstances: VariableComponent = ({ variableId }) => {
  const { t } = useTranslation('common')
  const {
    query: { projectId, algorithmId },
  } = useAppRouter()

  const { data, isSuccess } = useGetInstancesQuery({
    nodeId: variableId,
    algorithmId: algorithmId,
  })

  const type = (instance: Unpacked<GetInstances>): string => {
    if (instance.diagnosisId !== null) {
      return 'Diagnosis'
    }

    return instance.instanceableType
  }

  console.log(data)

  if (isSuccess) {
    return (
      <Card my={5}>
        <Box p={4} borderBottom='2px solid' borderBottomColor='pipe'>
          <Text fontWeight='bold' fontSize='lg'>
            {t('noOfDecisionTrees', { count: data.length, ns: 'variables' })}
          </Text>
        </Box>
        <TableContainer>
          <Table>
            <Thead>
              <Tr>
                <Th>{t('name')}</Th>
                <Th>{t('type')}</Th>
              </Tr>
            </Thead>
            <Tbody>
              {data.length === 0 ? (
                <Tr>
                  <Td colSpan={10}>
                    <Text align='center'>
                      {t('noData', { ns: 'datatable' })}
                    </Text>
                  </Td>
                </Tr>
              ) : (
                data.map(instance => (
                  <Tr key={instance.id}>
                    <Td>{instance.diagramName}</Td>
                    <Td>
                      {t(`nodeType.${type(instance)}`, {
                        defaultValue: '',
                      })}
                    </Td>
                    <Td textAlign='right'>
                      <DiagramButton
                        href={`/projects/${projectId}/diagram/${DiagramService.getUrlFromInstanceableType(
                          instance.instanceableType as DiagramEnum
                        )}/${instance.instanceableId}`}
                      >
                        {t('openDiagram')}
                      </DiagramButton>
                    </Td>
                  </Tr>
                ))
              )}
            </Tbody>
          </Table>
        </TableContainer>
      </Card>
    )
  }

  return <Spinner size='xl' />
}

export default VariableInstances
