/**
 * The external imports
 */
import { useTranslation } from 'next-i18next'
import { SimpleGrid, VStack } from '@chakra-ui/react'

/**
 * The internal imports
 */
import {
  AdministrationRoute,
  Breakable,
  ByAge,
  Number,
  UniqueDose,
  LiquidConcentration,
  DoseForm,
  MaximalDose,
  MinimalDosePerKg,
  MaximalDosePerKg,
  InjectionInstructions,
  Textarea,
} from '@/components'
import { useGetProjectQuery } from '@/lib/api/modules'
import type { FormulationComponent } from '@/types'

const FormulationForm: FormulationComponent = ({ projectId, index }) => {
  const { t } = useTranslation('formulations')

  const { data: project, isSuccess: isGetProjectSuccess } = useGetProjectQuery({
    id: projectId,
  })

  if (isGetProjectSuccess) {
    return (
      <VStack align='left' spacing={8}>
        <SimpleGrid columns={2} spacing={10}>
          <AdministrationRoute projectId={projectId} index={index} />
          <Number
            name={`formulationsAttributes[${index}].dosesPerDay`}
            label={t('dosesPerDay')}
            isRequired
          />
          <ByAge index={index} />
          <Breakable index={index} />
          <UniqueDose index={index} />
          <LiquidConcentration index={index} />
          <DoseForm index={index} />
          <MaximalDose index={index} />
          <MinimalDosePerKg index={index} />
          <MaximalDosePerKg index={index} />
        </SimpleGrid>

        <InjectionInstructions index={index} projectId={projectId} />

        <Textarea
          name={`formulationsAttributes[${index}].description`}
          label={t('description')}
          helperText={t('helperText', {
            language: t(`languages.${project.language.code}`, {
              ns: 'common',
              defaultValue: '',
            }),
            ns: 'common',
          })}
        />

        <Textarea
          name={`formulationsAttributes[${index}].dispensingDescription`}
          label={t('dispensingDescription')}
          helperText={t('helperText', {
            language: t(`languages.${project.language.code}`, {
              ns: 'common',
              defaultValue: '',
            }),
            ns: 'common',
          })}
        />
      </VStack>
    )
  }

  return null
}

export default FormulationForm
