/**
 * The external imports
 */
import { useEffect, useMemo } from 'react'
import { skipToken } from '@reduxjs/toolkit/dist/query'
import { useTranslation } from 'next-i18next'

/**
 * The internal imports
 */
import { useGetAlgorithmQuery } from '@/lib/api/modules/enhanced/algorithm.enhanced'
import { useToast } from '@/lib/hooks/useToast'
import { AlgorithmStatusEnum } from '@/types'

export function useAlgorithm(algorithmId?: string) {
  const { t } = useTranslation('common')
  const { newToast } = useToast()

  const { data, isError, isSuccess } = useGetAlgorithmQuery(
    algorithmId ? { id: algorithmId } : skipToken
  )

  useEffect(() => {
    if (isError) {
      newToast({
        message: t('errorBoundary.generalError'),
        status: 'error',
      })
    }
  }, [isError])

  const isRestricted = useMemo(() => {
    if (isSuccess) {
      return [AlgorithmStatusEnum.Prod, AlgorithmStatusEnum.Archived].includes(
        data.status
      )
    }

    return true
  }, [isSuccess])

  return {
    algorithm: data,
    isRestricted,
  }
}
