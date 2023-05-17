/**
 * The external imports
 */
import { Box, Text, VStack } from '@chakra-ui/react'
import { Trans, useTranslation } from 'next-i18next'
import type { FC } from 'react'

const FormulaInformation: FC = () => {
  const { t } = useTranslation('variables')

  return (
    <VStack w='full' alignItems='flex-start'>
      <Text>{t('formulaInformation.formulaTitle')}</Text>
      <Text>
        <Trans
          i18nKey='formulaInformation.formulaContent'
          t={t}
          components={{
            i: <Text as='span' fontStyle='italic' />,
            strong: <Text as='span' fontWeight='bold' />,
          }}
        />
      </Text>
    </VStack>
  )
}

export default FormulaInformation
