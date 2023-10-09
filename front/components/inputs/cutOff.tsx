/**
 * The external imports
 */
import React from 'react'
import { SimpleGrid, VStack, useConst } from '@chakra-ui/react'
import { useTranslation } from 'next-i18next'

/**
 * The internal imports
 */
import Select from '@/components/inputs/select'
import Number from '@/components/inputs/number'
import { type CutOffComponent, CutOffValueTypesEnum } from '@/types'

const CutOff: CutOffComponent = ({ columns = 2 }) => {
  const { t } = useTranslation('decisionTrees')

  const cutOffValueTypesOptions = useConst(() =>
    Object.values(CutOffValueTypesEnum).map(cutOffValue => ({
      value: cutOffValue,
      label: t(`enum.cutOffValueTypes.${cutOffValue}`),
    }))
  )

  return (
    <VStack spacing={8}>
      <Select
        name='cutOffValueType'
        label={t('cutOffValueType')}
        options={cutOffValueTypesOptions}
      />
      <SimpleGrid columns={columns} spacing={4} w='full' mb={4}>
        <Number name='cutOffStart' label={t('cutOffStart')} />
        <Number name='cutOffEnd' label={t('cutOffEnd')} />
      </SimpleGrid>
    </VStack>
  )
}

export default CutOff
