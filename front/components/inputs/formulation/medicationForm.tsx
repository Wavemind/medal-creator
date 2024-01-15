/**
 * The external imports
 */
import React, { ChangeEvent, useMemo, useState } from 'react'
import { Button, Select, VStack } from '@chakra-ui/react'
import { useTranslation } from 'next-i18next'

/**
 * The internal imports
 */
import { MedicationFormEnum } from '@/lib/config/constants'
import type { MedicationFormComponent } from '@/types'

const MedicationForm: MedicationFormComponent = ({
  append,
  onAppend,
  isRestricted,
}) => {
  const { t } = useTranslation('formulations')

  const [medicationForm, setMedicationForm] = useState('')

  const medicationFormOptions = useMemo(
    () =>
      Object.values(MedicationFormEnum).map(medicationForm => ({
        value: medicationForm,
        label: t(`medicationForms.${medicationForm}`, { defaultValue: '' }),
      })),
    [t]
  )

  /**
   * Add formulation
   */
  const addFormulation = () => {
    if (medicationForm) {
      append({ medicationForm: medicationForm, _destroy: false })
      onAppend()
      setMedicationForm('')
    }
  }

  const handleMedicationFormChange = (
    e: ChangeEvent<HTMLSelectElement>
  ): void => {
    setMedicationForm(e.target.value)
  }

  return (
    <VStack spacing={6} mt={12}>
      <Select
        onChange={handleMedicationFormChange}
        value={medicationForm}
        name='medicationForm'
        placeholder={t('select', { ns: 'common' })}
        isDisabled={isRestricted}
      >
        {medicationFormOptions.map(option => (
          <option key={option.value} value={option.value}>
            {option.label}
          </option>
        ))}
      </Select>
      <Button
        onClick={addFormulation}
        w='full'
        data-testid='add-medication-form'
        isDisabled={!medicationForm || isRestricted}
      >
        {t('add', { ns: 'common' })}
      </Button>
    </VStack>
  )
}

export default MedicationForm
