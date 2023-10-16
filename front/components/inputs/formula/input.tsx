/**
 * The external imports
 */
import React, { useEffect, useMemo, type FC } from 'react'
import { ErrorMessage } from '@hookform/error-message'
import { useTranslation } from 'next-i18next'
import { Controller, useFormContext } from 'react-hook-form'
import {
  Input as ChakraInput,
  FormControl,
  FormErrorMessage,
  HStack,
  VStack,
} from '@chakra-ui/react'
import get from 'lodash/get'

/**
 * The internal imports
 */
import FormLabel from '@/components/formLabel'
import FormulaInformation from '@/components/drawer/formulaInformation'
import { useFormula, useDrawer } from '@/lib/hooks'
import Badge from '@/components/inputs/formula/badge'
import InformationIcon from '@/assets/icons/Information'
import { camelize, extractFormula } from '@/lib/utils/string'

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
  const formulaArray = useMemo(() => extractFormula(inputValue), [inputValue])

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
   * Render in human readable way input to include tags and colors
   */
  const renderBadge = (formula: string) => {
    if (formula.match(/^\[([^\]]+)]$/)) {
      const variableId = formula.replace(/[[\]]/g, '')
      return <Badge variableId={variableId} />
    } else if (formula.match(/^{To(Day|Month)}$/)) {
      const cleaningString = formula.replace(/{|}/g, '')
      return <Badge>{t(`formulaFunctions.${camelize(cleaningString)}`)}</Badge>
    } else if (formula.match(/^{To(Day|Month)\(([^)]+)\)}$/)) {
      const stringWithoutCurclyBraces = formula.replace(/{|}/g, '')
      const splitStringByParentheses =
        stringWithoutCurclyBraces.split(/\(([^)]+)\)/g)
      return (
        <Badge
          functionName={splitStringByParentheses[0]}
          variableId={splitStringByParentheses[1]}
        />
      )
    }
    return formula
  }

  return (
    <FormControl isInvalid={!!error}>
      <HStack alignItems='right'>
        <FormLabel name='formula' isRequired={true}>
          {t('formula')}
        </FormLabel>

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
              placeholder={t('formulaPlaceholder')}
              ref={inputRef}
              value={inputValue}
              onChange={e => setInputValue(e.target.value)}
            />
          )}
        />

        <HStack
          w='full'
          flexWrap='wrap'
          p={4}
          bg='blackAlpha.50'
          borderRadius='2xl'
        >
          {formulaArray.map((element, index) => (
            <React.Fragment key={index}>{renderBadge(element)}</React.Fragment>
          ))}
        </HStack>
      </VStack>

      <ErrorMessage as={<FormErrorMessage />} name='formula' errors={errors} />
    </FormControl>
  )
}

export default FormulaInput
