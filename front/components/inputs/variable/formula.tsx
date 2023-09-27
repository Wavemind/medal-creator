/**
 * The external imports
 */
import React, { useEffect, useMemo, useRef } from 'react'
import { useTranslation } from 'next-i18next'
import { useFormContext } from 'react-hook-form'
import {
  Popover,
  PopoverContent,
  PopoverBody,
  PopoverAnchor,
  useDisclosure,
  Box,
  Portal,
  PopoverTrigger,
  HStack,
} from '@chakra-ui/react'
import type { FC, KeyboardEvent } from 'react'

/**
 * The internal imports
 */
import FormulaInformation from '@/components/drawer/formulaInformation'
import Input from '@/components/inputs/input'
import { DISPLAY_FORMULA_ANSWER_TYPE } from '@/lib/config/constants'

const Formula: FC = () => {
  const { t } = useTranslation('variables')

  const { isOpen, onClose, onOpen } = useDisclosure()

  const modalRef = useRef<HTMLDivElement | null>(null)

  const { watch, setValue, getValues } = useFormContext()
  const watchAnswerTypeId: string = watch('answerTypeId')

  const options = useMemo(
    () => ['D1', 'D2', 'D3', 'D4', 'D5', 'BT5', 'BT3'],
    []
  )

  useEffect(() => {
    if (
      !DISPLAY_FORMULA_ANSWER_TYPE.includes(parseInt(watchAnswerTypeId)) &&
      getValues('formula')
    ) {
      setValue('formula', undefined)
    }
  }, [watchAnswerTypeId])

  useEffect(() => {
    const detectFormulaKeys = (e: unknown) => {
      const keyboardEvent = e as KeyboardEvent<Document>

      if (keyboardEvent.key === '[') {
        onOpen()
      }

      if (keyboardEvent.key === ']') {
        onClose()
      }

      if (keyboardEvent.key === 'Backspace' && isOpen) {
        onClose()
      }
    }

    const formulaInput = document.querySelector('[name="formula"]')

    formulaInput?.addEventListener('keydown', detectFormulaKeys)

    return () => {
      formulaInput?.removeEventListener('keydown', detectFormulaKeys)
    }
  }, [])

  useEffect(() => {
    const modal = document.querySelector('[role="dialog"]')

    modalRef.current = modal as HTMLDivElement
  }, [])

  const selectOption = (option: string) => {
    const currentFormula = getValues('formula')

    const newFormula = currentFormula + option + ']'
    setValue('formula', newFormula)
    onClose()
  }

  if (DISPLAY_FORMULA_ANSWER_TYPE.includes(parseInt(watchAnswerTypeId))) {
    return (
      <Popover
        returnFocusOnClose={false}
        isOpen={isOpen}
        onClose={onClose}
        placement='top-start'
        closeOnBlur={true}
        autoFocus={false}
      >
        <HStack w='full' spacing={0}>
          <PopoverTrigger>
            <Box />
          </PopoverTrigger>
          <PopoverAnchor>
            <Input
              label={t('formula')}
              name='formula'
              isRequired
              hasDrawer
              drawerContent={<FormulaInformation />}
              drawerTitle={t('formulaInformation.formulaTooltipTitle')}
            />
          </PopoverAnchor>
        </HStack>
        <Portal containerRef={modalRef}>
          <PopoverContent overflow='hidden'>
            <PopoverBody p={0}>
              {options.map(option => (
                <Box
                  cursor='pointer'
                  p={1}
                  _hover={{ bg: 'pink' }}
                  onClick={() => selectOption(option)}
                >
                  {option}
                </Box>
              ))}
            </PopoverBody>
          </PopoverContent>
        </Portal>
      </Popover>
    )
  }

  return null
}

export default Formula
