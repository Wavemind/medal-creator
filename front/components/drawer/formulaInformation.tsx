/**
 * The external imports
 */
import { Text, VStack } from '@chakra-ui/react'
import { Trans, useTranslation } from 'next-i18next'
import type { FC } from 'react'

const FormulaInformation: FC = () => {
  const { t } = useTranslation('variables')

  return (
    <VStack w='full' alignItems='flex-start' spacing={8}>
      <VStack alignItems='flex-start'>
        <Text fontWeight='bold'>{t('formulaInformation.formulaTitle')}</Text>
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

      <VStack alignItems='flex-start'>
        <Text fontWeight='bold'>{t('formulaInformation.referenceTitle')}</Text>
        <Text>
          <Trans
            i18nKey='formulaInformation.referenceContent'
            t={t}
            components={{
              i: <Text as='span' fontStyle='italic' />,
              strong: <Text as='span' fontWeight='bold' />,
            }}
          />
        </Text>
      </VStack>

      <VStack alignItems='flex-start'>
        <Text fontWeight='bold'>{t('formulaInformation.dateTitle')}</Text>
        <Text>
          <Trans
            i18nKey='formulaInformation.dateContent'
            t={t}
            components={{
              i: <Text as='span' fontStyle='italic' />,
            }}
          />
        </Text>
      </VStack>
    </VStack>
  )
}

export default FormulaInformation
