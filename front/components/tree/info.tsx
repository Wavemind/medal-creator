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
  Button,
  Box,
  Text,
  useConst
} from '@chakra-ui/react'
import { useTranslation } from 'next-i18next'
import type { FC } from 'react'

const InfoModalContent: FC = () => {
  const { t } = useTranslation('consultationOrder')
  
  const data = useConst(() => [1])

  return (
    <Box
      boxShadow='0px 0px 4px rgba(0, 0, 0, 0.15)'
      borderColor='sidebar'
      borderRadius='lg'
      my={5}
    >
      <Box p={4} borderBottom='2px solid' borderBottomColor='pipe'>
        <Text fontWeight='bold' fontSize='lg'>
          Diagrams including variable
        </Text>
      </Box>
      <TableContainer>
        <Table>
          <Thead>
            <Tr>
              <Th>Name</Th>
              <Th>Type</Th>
            </Tr>
          </Thead>
          <Tbody>
            {data?.length === 0 ? (
              <Tr>
                <Td colSpan={10}>
                  <Text align='center'>{t('noData', { ns: 'datatable' })}</Text>
                </Td>
              </Tr>
            ) : (
              data?.map(() => (
                <Tr>
                  <Td>Pneumonia</Td>
                  <Td>Decision tree</Td>
                  <Td>
                    <Button onClick={() => console.log('TODO')}>
                      {t('openDecisionTree', { ns: 'datatable' })}
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

export default InfoModalContent
