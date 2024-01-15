/**
 * The external imports
 */
import React, { useState } from 'react'
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
  HStack,
} from '@chakra-ui/react'
import get from 'lodash/get'

/**
 * The internal imports
 */
import MedicationForm from '@/components/inputs/formulation/medicationForm'
import FormulationForm from '@/components/forms/formulation'
import ErrorMessage from '@/components/errorMessage'
import DeleteIcon from '@/assets/icons/Delete'
import type { FormulationsComponent, DrugInputs } from '@/types'

const FormulationsForm: FormulationsComponent = ({ isRestricted }) => {
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

  const onAppend = () => {
    setExpanded(prev => [...prev, fields.length].sort())
  }

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

    setExpanded(prev => {
      const newExpanded = prev.map(e => (e > index ? e - 1 : e))
      if (prev.includes(index)) {
        newExpanded.splice(index, 1)
      }
      return newExpanded.sort()
    })
  }

  const updateExpanded = (newExpanded: Array<number>) => {
    setExpanded(newExpanded.sort())
  }

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
        rounded='lg'
        index={expanded}
        onChange={updateExpanded}
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
                borderColor={
                  formulationsAttributesError &&
                  formulationsAttributesError[index]
                    ? 'red'
                    : 'inherit'
                }
              >
                <HStack pr={3}>
                  <AccordionButton
                    display='flex'
                    alignItems='center'
                    justifyContent='space-between'
                    p={4}
                    _hover={{ bg: 'gray.100' }}
                    borderRadius='2xl'
                    data-testid={`formulation-${field.medicationForm}`}
                  >
                    <HStack>
                      <Heading variant='h3'>
                        {t(`medicationForms.${field.medicationForm}`, {
                          defaultValue: '',
                          ns: 'formulations',
                        })}
                      </Heading>
                    </HStack>
                  </AccordionButton>
                  <Button
                    variant='ghost'
                    _hover={{ bg: 'gray.200' }}
                    onClick={() => handleRemove(index)}
                    isDisabled={isRestricted}
                    data-testid={`remove-formulations-${field.medicationForm}`}
                  >
                    <DeleteIcon boxSize={4} />
                  </Button>
                </HStack>

                <AccordionPanel pb={4}>
                  <FormulationForm index={index} isRestricted={isRestricted} />
                </AccordionPanel>
              </AccordionItem>
            )
          }
        })}
      </Accordion>
      <MedicationForm
        append={append}
        onAppend={onAppend}
        isRestricted={isRestricted}
      />
    </React.Fragment>
  )
}

export default FormulationsForm
