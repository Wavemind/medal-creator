/**
 * The external imports
 */
import { Fragment } from 'react'
import { Box, Heading, List, ListIcon, ListItem } from '@chakra-ui/react'
import { useTranslation } from 'next-i18next'
import type { FC } from 'react'

/**
 * The internal imports
 */
import WarningIcon from '@/assets/icons/Warning'
import CloseIcon from '@/assets/icons/Close'

const ValidationInformation: FC<{
  errors: string[]
  warnings: string[]
}> = data => {
  const { t } = useTranslation('diagram')

  return (
    <Box>
      {data.errors.length > 0 && (
        <Fragment>
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
        </Fragment>
      )}
      {data.warnings.length > 0 && (
        <Fragment>
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
        </Fragment>
      )}
    </Box>
  )
}

export default ValidationInformation
