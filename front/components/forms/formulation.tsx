/**
 * The external imports
 */
import { useTranslation } from 'next-i18next'
import { SimpleGrid, VStack } from '@chakra-ui/react'

/**
 * The internal imports
 */
import AdministrationRoute from '@/components/inputs/formulation/administrationRoute'
import Breakable from '@/components/inputs/formulation/breakable'
import ByAge from '@/components/inputs/formulation/byAge'
import Number from '@/components/inputs/number'
import UniqueDose from '@/components/inputs/formulation/uniqueDose'
import LiquidConcentration from '@/components/inputs/formulation/liquidConcentration'
import DoseForm from '@/components/inputs/formulation/doseForm'
import MaximalDose from '@/components/inputs/formulation/maximalDose'
import MinimalDosePerKg from '@/components/inputs/formulation/minimalDosePerKg'
import MaximalDosePerKg from '@/components/inputs/formulation/maximalDosePerKg'
import InjectionInstructions from '@/components/inputs/formulation/injectionInstructions'
import Textarea from '@/components/inputs/textarea'
import { useProject } from '@/lib/hooks/useProject'
import type { FormulationComponent } from '@/types'

const FormulationForm: FormulationComponent = ({ index, isRestricted }) => {
  const { t } = useTranslation('formulations')
  const { projectLanguage } = useProject()

  return (
    <VStack align='left' spacing={8}>
      <SimpleGrid columns={2} spacing={10}>
        <AdministrationRoute index={index} isDisabled={isRestricted} />
        <Number
          name={`formulationsAttributes[${index}].dosesPerDay`}
          label={t('dosesPerDay')}
          isRequired
          isDisabled={isRestricted}
        />
        <ByAge index={index} isDisabled={isRestricted} />
        <Breakable index={index} isDisabled={isRestricted} />
        <UniqueDose index={index} isDisabled={isRestricted} />
        <LiquidConcentration index={index} isDisabled={isRestricted} />
        <DoseForm index={index} isDisabled={isRestricted} />
        <MaximalDose index={index} isDisabled={isRestricted} />
        <MinimalDosePerKg index={index} isDisabled={isRestricted} />
        <MaximalDosePerKg index={index} isDisabled={isRestricted} />
      </SimpleGrid>

      <InjectionInstructions index={index} isDisabled={isRestricted} />

      <Textarea
        name={`formulationsAttributes[${index}].description`}
        label={t('description')}
        isDisabled={isRestricted}
        helperText={t('helperText', {
          language: t(`languages.${projectLanguage}`, {
            ns: 'common',
            defaultValue: '',
          }),
          ns: 'common',
        })}
      />

      <Textarea
        name={`formulationsAttributes[${index}].dispensingDescription`}
        label={t('dispensingDescription')}
        isDisabled={isRestricted}
        helperText={t('helperText', {
          language: t(`languages.${projectLanguage}`, {
            ns: 'common',
            defaultValue: '',
          }),
          ns: 'common',
        })}
      />
    </VStack>
  )
}

export default FormulationForm
