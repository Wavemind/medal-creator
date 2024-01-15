/**
 * The external imports
 */
import { useTranslation } from 'next-i18next'
import { VStack } from '@chakra-ui/react'

/**
 * The internal imports
 */
import Checkbox from '@/components/inputs/checkbox'
import Input from '@/components/inputs/input'
import Slider from '@/components/inputs/slider'
import Textarea from '@/components/inputs/textarea'
import { useProject } from '@/lib/hooks/useProject'
import type { DrugFormComponent } from '@/types'

const DrugForm: DrugFormComponent = ({ isRestricted }) => {
  const { t } = useTranslation('drugs')
  const { projectLanguage } = useProject()

  return (
    <VStack align='left' spacing={8}>
      <Input
        name='label'
        label={t('label')}
        isRequired
        helperText={t('helperText', {
          language: t(`languages.${projectLanguage}`, {
            ns: 'common',
            defaultValue: '',
          }),
          ns: 'common',
        })}
      />
      <Textarea
        name='description'
        label={t('description')}
        helperText={t('helperText', {
          language: t(`languages.${projectLanguage}`, {
            ns: 'common',
            defaultValue: '',
          }),
          ns: 'common',
        })}
      />
      <Checkbox
        label={t('isNeonat')}
        name='isNeonat'
        isDisabled={isRestricted}
      />
      <Checkbox
        label={t('isAntiMalarial')}
        name='isAntiMalarial'
        isDisabled={isRestricted}
      />
      <Checkbox
        label={t('isAntibiotic')}
        name='isAntibiotic'
        isDisabled={isRestricted}
      />
      <Slider
        name='levelOfUrgency'
        label={t('levelOfUrgency')}
        isDisabled={isRestricted}
      />
    </VStack>
  )
}

export default DrugForm
