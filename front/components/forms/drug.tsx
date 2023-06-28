/**
 * The external imports
 */
import { useTranslation } from 'next-i18next'
import { Spinner, VStack } from '@chakra-ui/react'

/**
 * The internal imports
 */
import { Checkbox, Input, Slider, Textarea } from '@/components'
import { useGetProjectQuery } from '@/lib/api/modules'
import type { DrugFormComponent } from '@/types'

const DrugForm: DrugFormComponent = ({ projectId }) => {
  const { t } = useTranslation('drugs')

  const { data: project, isSuccess: isGetProjectSuccess } = useGetProjectQuery({
    id: projectId,
  })

  if (isGetProjectSuccess) {
    return (
      <VStack align='left' spacing={8}>
        <Input
          name='label'
          label={t('label')}
          isRequired
          helperText={t('helperText', {
            language: t(`languages.${project.language.code}`, {
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
            language: t(`languages.${project.language.code}`, {
              ns: 'common',
              defaultValue: '',
            }),
            ns: 'common',
          })}
        />
        <Checkbox label={t('isNeonat')} name='isNeonat' />
        <Checkbox label={t('isAntiMalarial')} name='isAntiMalarial' />
        <Checkbox label={t('isAntibiotic')} name='isAntibiotic' />
        <Slider name='levelOfUrgency' label={t('levelOfUrgency')} />
      </VStack>
    )
  }

  return <Spinner size='xl' />
}

export default DrugForm
