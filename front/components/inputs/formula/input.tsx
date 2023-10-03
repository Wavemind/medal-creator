/**
 * The external imports
 */
import React, { useEffect, type FC } from 'react'
import { ErrorMessage } from '@hookform/error-message'
import { useTranslation } from 'next-i18next'
import { Controller, useFormContext } from 'react-hook-form'
import {
  Input as ChakraInput,
  FormLabel,
  FormControl,
  FormErrorMessage,
  HStack,
  VStack,
} from '@chakra-ui/react'
import get from 'lodash/get'

/**
 * The internal imports
 */
import FormulaInformation from '@/components/drawer/formulaInformation'
import { useFormula, useDrawer } from '@/lib/hooks'
import Badge from '@/components/inputs/formula/badge'
import InformationIcon from '@/assets/icons/Information'

const FormulaInput: FC = () => {
  const { t } = useTranslation('variables')

  const { inputValue, setInputValue, inputRef } = useFormula()
  const { open, isOpen, close } = useDrawer()
  const {
    control,
    setValue,
    getValues,
    formState: { errors },
  } = useFormContext()

  const error = get(errors, 'formula')

  /**
   * Set the inputValue to the value in RHF formula
   * This is used if the user returns to the form in the stepper
   */
  useEffect(() => {
    const formula = getValues('formula')
    if (!inputValue && formula) {
      setInputValue(formula)
    }
  }, [])

  /**
   * Update the formula value in RHF when the inputValue changes
   */
  useEffect(() => {
    setValue('formula', inputValue)
  }, [inputValue])

  /**
   * Toggles the drawer
   */
  const handleToggle = () => {
    if (isOpen) {
      close()
    } else {
      open({
        title: t('formulaInformation.formulaTooltipTitle'),
        content: <FormulaInformation />,
      })
    }
  }

  /**
   * Transforms input to include tags and colors
   */
  const parseInput = (text: string) => {
    // Track [] or ToDay([]) or ToMonth([])
    const regex = /(\[[^[\]]+\]|ToDay\([^)]+\)|ToMonth\([^)]+\))/g
    const parts = text.split(regex)
    return parts.map((part, index) => {
      if (part.match(/^\[([^\]]+)]$/)) {
        const key = `${part}-${index}`
        // Get element inside []
        const badgeContent = part.replace(/[[\]]/g, '')
        return <Badge key={key}>{badgeContent}</Badge>
      } else if (part.startsWith('ToDay(') || part.startsWith('ToMonth(')) {
        const cleanedString = part.replace(/[[\]]/g, '') // Remove [] inside ()
        return (
          <Badge key={index} isFunction={true}>
            {cleanedString}
          </Badge>
        )
      }
      return part
    })
  }

  return (
    <FormControl isInvalid={!!error} isRequired>
      <HStack alignItems='right'>
        <FormLabel htmlFor='formula'>{t('formula')}</FormLabel>
        <InformationIcon
          onClick={handleToggle}
          cursor='pointer'
          data-testid='info-formula'
        />
      </HStack>

      <VStack>
        <Controller
          control={control}
          name='formula'
          render={() => (
            <ChakraInput
              id='formula'
              name='formula'
              ref={inputRef}
              value={inputValue}
              onChange={e => setInputValue(e.target.value)}
            />
          )}
        />

        <HStack w='full' h={10} px={4} bg='blackAlpha.50' borderRadius='2xl'>
          {parseInput(inputValue).map((element, index) => (
            <React.Fragment key={index}>{element}</React.Fragment>
          ))}
        </HStack>
      </VStack>

      <ErrorMessage as={<FormErrorMessage />} name='formula' errors={errors} />
    </FormControl>
  )
}

export default FormulaInput
