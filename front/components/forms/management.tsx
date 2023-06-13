/**
 * The external imports
 */
import { useTranslation } from 'next-i18next'
import { Spinner, Text } from '@chakra-ui/react'
import { yupResolver } from '@hookform/resolvers/yup'
import * as yup from 'yup'

/**
 * The internal imports
 */
import { useGetProjectQuery } from '@/lib/api/modules'
import type { ManagementFormComponent, ManagementInputs } from '@/types'
import { useForm } from 'react-hook-form'

const ManagementForm: ManagementFormComponent = ({ projectId }) => {
  const { t } = useTranslation('managements')

  const { data: project, isSuccess: isGetProjectSuccess } =
    useGetProjectQuery(projectId)

  const methods = useForm<ManagementInputs>({
    resolver: yupResolver(
      yup.object({
        label: yup.string().label(t('label')).required(),
        levelOfUrgency: yup
          .number()
          .transform(value => (isNaN(value) ? undefined : value))
          .nullable(),
      })
    ),
    reValidateMode: 'onSubmit',
    defaultValues: {
      label: '',
      description: '',
      levelOfUrgency: 5,
      isReferral: false,
      projectId: projectId,
    },
  })

  if (isGetProjectSuccess) {
    return <Text>Hello</Text>
  }

  return <Spinner size='xl' />
}

export default ManagementForm
