/**
 * The external imports
 */
import { useMemo } from 'react'
import { Badge } from '@chakra-ui/react'
import { useTranslation } from 'next-i18next'

/**
 * The internal imports
 */
import { type AlgorithmStatusComponent, AlgorithmStatusEnum } from '@/types'

const AlgorithmStatus: AlgorithmStatusComponent = ({ status }) => {
  const { t } = useTranslation('algorithms')

  const colorScheme = useMemo(() => {
    switch (status) {
      case AlgorithmStatusEnum.Archived:
        return 'red'
      case AlgorithmStatusEnum.Draft:
        return 'yellow'
      case AlgorithmStatusEnum.Prod:
        return 'green'
      default:
        return 'purple'
    }
  }, [status])

  return (
    <Badge
      colorScheme={colorScheme}
      variant='subtle'
      borderRadius='full'
      py={1}
      px={2}
    >
      {t(`enum.status.${status}`)}
    </Badge>
  )
}

export default AlgorithmStatus
