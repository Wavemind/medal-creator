/**
 * The external imports
 */
import React, { ChangeEvent, useMemo, useState } from 'react'
import { useTranslation } from 'next-i18next'

/**
 * The internal imports
 */
import { Button, HStack, Select } from '@chakra-ui/react'
import type { MedicationFormComponent } from '@/types'
import { MedicationFormEnum } from '@/lib/config/constants'

const MedicationForm: MedicationFormComponent = ({ append }) => {
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
      append({ medicationForm: medicationForm })
      setMedicationForm('')
    }
  }

  const handleMedicationFormChange = (
    e: ChangeEvent<HTMLSelectElement>
  ): void => {
    setMedicationForm(e.target.value)
  }

  return (
    <HStack alignItems='end'>
      <Select
        onChange={handleMedicationFormChange}
        value={medicationForm}
        placeholder={t('select', { ns: 'common' })}
      >
        {medicationFormOptions.map(option => (
          <option key={option.value} value={option.value}>
            {option.label}
          </option>
        ))}
      </Select>
      <Button onClick={addFormulation}>{t('add', { ns: 'common' })}</Button>
    </HStack>
  )
}

export default MedicationForm
