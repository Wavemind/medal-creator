/**
 * The external imports
 */
import React, { useEffect } from 'react'
import { useFormContext } from 'react-hook-form'
import { Box } from '@chakra-ui/react'
import type { FC } from 'react'

/**
 * The internal imports
 */
import { DISPLAY_FORMULA_ANSWER_TYPE } from '@/lib/config/constants'
import FormulaProvider from '@/lib/providers/formula'
import FormulaInput from '@/components/inputs/formula/input'
import FormulaMenu from '@/components/inputs/formula/menu'

const Formula: FC = () => {
  const { watch, setValue, getValues } = useFormContext()
  const watchAnswerTypeId: string = watch('answerTypeId')

  /**
   * If the formula field is not visible, reset the formula field in RHF
   */
  useEffect(() => {
    if (
      !DISPLAY_FORMULA_ANSWER_TYPE.includes(parseInt(watchAnswerTypeId)) &&
      getValues('formula')
    ) {
      setValue('formula', undefined)
    }
  }, [watchAnswerTypeId])

  if (DISPLAY_FORMULA_ANSWER_TYPE.includes(parseInt(watchAnswerTypeId))) {
    return (
      <FormulaProvider>
        <Box position='relative' w='full'>
          <FormulaInput />
          <FormulaMenu />
        </Box>
      </FormulaProvider>
    )
  }

  return null
}

export default Formula
