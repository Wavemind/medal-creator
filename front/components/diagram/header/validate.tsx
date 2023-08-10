/**
 * The external imports
 */
import React, { useContext, useEffect, useMemo, useState } from 'react'
import { Button, Box, Badge } from '@chakra-ui/react'
import { useTranslation } from 'next-i18next'

/**
 * The internal imports
 */
import ValidationInformation from '@/components/drawer/validationInformation'
import { useAppRouter, useToast } from '@/lib/hooks'
import { DrawerContext } from '@/lib/contexts'
import { useLazyValidateQuery } from '@/lib/api/modules/enhanced/validate.enhanced'
import type { DiagramTypeComponent } from '@/types'

const Validate: DiagramTypeComponent = ({ diagramType }) => {
  const { t } = useTranslation('diagram')

  const [isFirstValidation, setIsFirstValidation] = useState(true)

  const { open: openDrawer } = useContext(DrawerContext)
  const { newToast } = useToast()

  const {
    query: { instanceableId },
  } = useAppRouter()

  const [
    validate,
    {
      data: validateData,
      isLoading: isLoadingValidate,
      isSuccess: isValidateSuccess,
      isFetching: isValidateFetching,
    },
  ] = useLazyValidateQuery()

  const nbIssues = useMemo(() => {
    if (validateData && isValidateSuccess) {
      return validateData.errors.length + validateData.warnings.length
    } else {
      return 0
    }
  }, [isValidateFetching])

  /**
   * Validate current diagram
   */
  const handleValidation = async (): Promise<void> => {
    const result = await validate(
      { instanceableId, instanceableType: diagramType },
      false
    )

    if (
      !isFirstValidation &&
      result.data &&
      result.data?.errors.length + result.data?.warnings.length > 0
    ) {
      handleOpenDrawer(result.data)
    }
  }

  /**
   * Open drawer and display errors and warnings
   * @param data hash with data from the API
   */
  const handleOpenDrawer = (data: {
    errors: string[]
    warnings: string[]
  }): void => {
    openDrawer({
      content: (
        <ValidationInformation errors={data.errors} warnings={data.warnings} />
      ),
    })
  }

  useEffect(() => {
    if (validateData && isValidateSuccess && !isValidateFetching) {
      if (isFirstValidation && nbIssues > 0) {
        newToast({
          message: (
            <Button
              variant='link'
              onClick={() => handleOpenDrawer(validateData)}
            >
              {t('invalid')}
            </Button>
          ),
          status: 'info',
        })
        setIsFirstValidation(false)
      } else if (nbIssues === 0) {
        newToast({
          message: t('valid'),
          status: 'success',
        })
      }
    }
  }, [isValidateSuccess, isValidateFetching])

  return (
    <Box position='relative'>
      <Button
        as={Button}
        onClick={handleValidation}
        isLoading={isLoadingValidate}
      >
        {t('validate')}
      </Button>
      {validateData && nbIssues > 0 && (
        <Badge
          colorScheme='red'
          pos='absolute'
          variant='solid'
          bgColor='red.500'
          right={-1}
          top={-1}
          borderRadius='full'
        >
          {nbIssues}
        </Badge>
      )}
    </Box>
  )
}

export default Validate
