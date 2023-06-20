/**
 * The external imports
 */
import React from 'react'
import { useTranslation } from 'next-i18next'
import { useFieldArray, useFormContext } from 'react-hook-form'
import {
  Accordion,
  AccordionButton,
  AccordionItem,
  AccordionPanel,
  AccordionIcon,
  Button,
  Text,
  Flex,
} from '@chakra-ui/react'
import { get } from 'lodash'

/**
 * The internal imports
 */
import { MedicationForm, FormulationForm, ErrorMessage } from '@/components'
import type { FormulationsComponent, DrugInputs } from '@/types'

const FormulationsForm: FormulationsComponent = ({ projectId }) => {
  const { t } = useTranslation('drugs')

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
  }

  return (
    <React.Fragment>
      <MedicationForm append={append} />
      {formulationsAttributesError && (
        <Flex justifyContent='center' my={6}>
          <ErrorMessage error={formulationsAttributesError.message} />
        </Flex>
      )}
      <Accordion mt={4} allowMultiple rounded='lg'>
        {fields.map((field, index) => {
          if (!field._destroy) {
            return (
              <AccordionItem key={field.id}>
                <AccordionButton
                  display='flex'
                  alignItems='center'
                  justifyContent='space-between'
                  p={4}
                  _hover={{ bg: 'gray.100' }}
                >
                  <Text fontSize='md'>
                    {t(`medicationForms.${field.medicationForm}`, {
                      defaultValue: '',
                      ns: 'formulations',
                    })}
                  </Text>
                  <AccordionIcon />
                </AccordionButton>
                <AccordionPanel pb={4}>
                  <Button onClick={() => handleRemove(index)}>X</Button>
                  <FormulationForm projectId={projectId} index={index} />
                </AccordionPanel>
              </AccordionItem>
            )
          }
        })}
      </Accordion>
    </React.Fragment>
  )
}

export default FormulationsForm
