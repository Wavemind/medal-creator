/**
 * The external imports
 */
// import {} from '@chakra-ui/react'

import { useGetDiagnosisQuery } from '/lib/services/modules/diagnose'

/**
 * The internal imports
 */

const DiagnosisDetail = ({ diagnoseId }) => {
  const { data: diagnosis } = useGetDiagnosisQuery(diagnoseId)

  return (
    <Box>
      <Heading></Heading>
    </Box>
  )
}

export default DiagnosisDetail
