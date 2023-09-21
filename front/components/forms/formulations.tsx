/**
 * The external imports
 */
import React, { useEffect, useState } from 'react'
import { useTranslation } from 'next-i18next'
import { useFieldArray, useFormContext } from 'react-hook-form'
import {
  Accordion,
  AccordionButton,
  AccordionItem,
  AccordionPanel,
  Button,
  Flex,
  Heading,
} from '@chakra-ui/react'
import get from 'lodash/get'

/**
 * The internal imports
 */
import MedicationForm from '@/components/inputs/formulation/medicationForm'
import FormulationForm from '@/components/forms/formulation'
import ErrorMessage from '@/components/errorMessage'
import type { FormulationsComponent, DrugInputs } from '@/types'
import DeleteIcon from '@/assets/icons/Delete'

const FormulationsForm: FormulationsComponent = ({ projectId }) => {
  const { t } = useTranslation('drugs')

  const [expanded, setExpanded] = useState<Array<number>>([])

  const {
    control,
    formState: { errors },
  } = useFormContext<DrugInputs>()

  const formulationsAttributesError = get(errors, 'formulationsAttributes')

  const { fields, append, remove, update } = useFieldArray({
    control,
    name: 'formulationsAttributes',
  })

  /**
   * Remove formulation in creation or add _destroy in update mode
   * @param formulation position in fields array
   */
  const handleRemove = (index: number): void => {
    const currentField = fields[index]

    // Check if formulationId exist in currentField
    if (Object.prototype.hasOwnProperty.call(currentField, 'formulationId')) {
      update(index, { ...currentField, _destroy: true })
    } else {
      remove(index)
    }

    if (expanded.includes(index)) {
      setExpanded(prev => {
        const transformPrevExpanded = prev.map((prevIndex, i) => {
          if (i > index) {
            return prevIndex - 1
          }
          return prevIndex
        })
        transformPrevExpanded.splice(index, 1)

        return transformPrevExpanded
      })
    }
  }

  // useEffect(() => {
  //   if (fields.length > 0) {
  //     setExpanded(prev => [...prev, fields.length - 1])
  //   }
  // }, [fields])

  const handleClick = (index: number) => {
    console.log('in here ?????!!!!')
    setExpanded(prev => {
      const foundIndex = prev.indexOf(index)
      if (foundIndex > -1) {
        const prevExpanded = [...prev]
        prevExpanded.splice(foundIndex, 1)
        return prevExpanded
      }

      return [...prev, index]
    })
  }

  console.log(expanded)

  // TODO : Remove the button from the accordion button. Check with Colin where to put it
  // To fix this console error : validateDOMNesting(...): <button> cannot appear as a descendant of <button>.
  return (
    <React.Fragment>
      {formulationsAttributesError && (
        <Flex justifyContent='center' my={6}>
          <ErrorMessage error={formulationsAttributesError.message} />
        </Flex>
      )}
      <Accordion
        mt={4}
        allowMultiple
        reduceMotion
        index={expanded}
        rounded='lg'
      >
        {fields.map((field, index) => {
          if (!field._destroy) {
            return (
              <AccordionItem
                key={field.id}
                data-testid={`formulation-content-${field.medicationForm}`}
                borderRadius='2xl'
                my={2}
                borderWidth={1}
                boxShadow='0px 0px 4px rgba(0, 0, 0, 0.15)'
              >
                <AccordionButton
                  display='flex'
                  alignItems='center'
                  justifyContent='space-between'
                  p={4}
                  _hover={{ bg: 'gray.100' }}
                  borderRadius='2xl'
                  data-testid={`formulation-${field.medicationForm}`}
                  onClick={() => handleClick(index)}
                >
                  <Heading variant='h3'>
                    {t(`medicationForms.${field.medicationForm}`, {
                      defaultValue: '',
                      ns: 'formulations',
                    })}
                  </Heading>
                  <Button
                    variant='ghost'
                    _hover={{ bg: 'gray.200' }}
                    onClick={() => handleRemove(index)}
                    data-testid={`remove-formulations-${field.medicationForm}`}
                  >
                    <DeleteIcon boxSize={4} />
                  </Button>
                </AccordionButton>
                <AccordionPanel pb={4}>
                  <FormulationForm projectId={projectId} index={index} />
                </AccordionPanel>
              </AccordionItem>
            )
          }
        })}
      </Accordion>
      <MedicationForm append={append} setExpanded={setExpanded} />
    </React.Fragment>
  )
}

export default FormulationsForm
