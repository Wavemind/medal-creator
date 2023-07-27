/**
 * The external imports
 */
import React, { useContext, useEffect, useMemo, useState } from 'react'
import {
  Heading,
  Button,
  Box,
  Badge,
  ListItem,
  ListIcon,
  List,
} from '@chakra-ui/react'
import { useTranslation } from 'next-i18next'

/**
 * The internal imports
 */
import { useAppRouter, useToast } from '@/lib/hooks'
import { DrawerContext } from '@/lib/contexts'
import { useLazyValidateQuery } from '@/lib/api/modules/enhanced/validate.enhanced'
import { WarningIcon, CloseIcon } from '@/assets/icons'
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

  const handleOpenDrawer = (data: {
    errors: string[]
    warnings: string[]
  }): void => {
    openDrawer({
      content: (
        <Box>
          {data.errors.length > 0 && (
            <React.Fragment>
              <Heading variant='h2' size='lg'>
                {t('errors')}
              </Heading>
              <List spacing={3}>
                {data.errors.map(error => (
                  <ListItem key={error}>
                    <ListIcon as={CloseIcon} color='secondary' />
                    {error}
                  </ListItem>
                ))}
              </List>
            </React.Fragment>
          )}
          {data.warnings.length > 0 && (
            <React.Fragment>
              <Heading variant='h2' size='lg'>
                {t('warnings')}
              </Heading>
              <List spacing={3}>
                {data.warnings.map(warning => (
                  <ListItem key={warning}>
                    <ListIcon as={WarningIcon} color='orange.500' />
                    {warning}
                  </ListItem>
                ))}
              </List>
            </React.Fragment>
          )}
        </Box>
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
