/**
 * The external imports
 */
import { useGetInstancesQuery } from '@/lib/api/modules/instance'
import {
  TableContainer,
  Table,
  Thead,
  Tr,
  Th,
  Tbody,
  Td,
  Button,
  Box,
  Text,
  Spinner,
} from '@chakra-ui/react'
import { useTranslation } from 'next-i18next'
import { useRouter } from 'next/router'

/**
 * The internal imports
 */
import type { VariableComponent, Instance } from '@/types'

const VariableInstances: VariableComponent = ({ variableId }) => {
  const { t } = useTranslation('common')
  const {
    query: { algorithmId },
  } = useRouter()

  const { data, isSuccess } = useGetInstancesQuery({
    nodeId: variableId,
    algorithmId: Number(algorithmId),
  })

  const type = (instance: Instance): string => {
    if (instance.diagnosisId !== null) {
      return 'Diagnosis'
    }

    return instance.instanceableType
  }

  if (isSuccess) {
    return (
      <Box
        boxShadow='0px 0px 4px rgba(0, 0, 0, 0.15)'
        borderColor='sidebar'
        borderRadius='lg'
        my={5}
      >
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
                      <Button onClick={() => console.log('TODO')}>
                        {t('openDiagram')}
                      </Button>
                    </Td>
                  </Tr>
                ))
              )}
            </Tbody>
          </Table>
        </TableContainer>
      </Box>
    )
  }

  return <Spinner size='xl' />
}

export default VariableInstances