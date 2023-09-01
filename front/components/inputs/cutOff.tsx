/**
 * The external imports
 */
import React from 'react'
import { SimpleGrid, useConst } from '@chakra-ui/react'
import { useTranslation } from 'next-i18next'

/**
 * The internal imports
 */
import Select from '@/components/inputs/select'
import Number from '@/components/inputs/number'

const CutOff = () => {
  const { t } = useTranslation('decisionTrees')

  const cutOffValueTypesOptions = useConst(() => [
    { value: 'months', label: t('enum.cutOffValueTypes.months') },
    { value: 'days', label: t('enum.cutOffValueTypes.days') },
  ])

  return (
    <React.Fragment>
      <Select
        name='cutOffValueType'
        label={t('cutOffValueType')}
        options={cutOffValueTypesOptions}
      />
      <SimpleGrid columns={2} spacing={8}>
        <Number name='cutOffStart' label={t('cutOffStart')} />
        <Number name='cutOffEnd' label={t('cutOffEnd')} />
      </SimpleGrid>
    </React.Fragment>
  )
}

export default CutOff
