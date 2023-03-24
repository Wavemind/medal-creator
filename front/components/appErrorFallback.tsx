/**
 * The external imports
 */
import {
  Alert,
  AlertIcon,
  AlertTitle,
  AlertDescription,
  Button,
  Stack,
  Text,
  Heading,
  Box,
} from '@chakra-ui/react'
import { useTranslation } from 'next-i18next'

/**
 * The internal imports
 */
import type { AppErrorFallbackComponent } from '@/types'

const AppErrorFallback: AppErrorFallbackComponent = ({
  error,
  errorInfo,
  resetErrorBoundary,
}) => {
  const { t } = useTranslation('common')

  const sliceErrorStack = (stackTrace = '', numLines = 10) => {
    const lines = stackTrace.split('\n')
    const firstNLines = lines.slice(0, numLines)
    const joinedLines = firstNLines.join('\n')
    return joinedLines
  }

  return (
    <Alert
      status='warning'
      variant='subtle'
      flexDirection='column'
      alignItems='center'
    >
      <AlertIcon boxSize='40px' mr={0} />
      <AlertTitle mt={4} mb={5} fontSize='4xl'>
        {t('errorBoundary.title')}
      </AlertTitle>
      <AlertDescription>
        <Stack spacing={8}>
          <Box>
            <Text>{t('errorBoundary.applicationDetectError')}</Text>
            <Text>{t('errorBoundary.reportBug')}</Text>
          </Box>

          <Button onClick={resetErrorBoundary}>
            {t('errorBoundary.reload')}
          </Button>

          <Heading as='h2' size='lg'>
            {t('errorBoundary.errorDetails')}
          </Heading>
          <Heading as='h3' size='md'>
            {t('errorBoundary.message')}
          </Heading>
          <pre>{error.message}</pre>
          <details>
            <summary>{t('errorBoundary.expand')}</summary>
            <Heading as='h4' size='sm' my={4}>
              {t('errorBoundary.stackTrace')}
            </Heading>
            <pre>{sliceErrorStack(error.stack)}</pre>
            <Heading as='h4' size='sm' my={4}>
              {t('errorBoundary.ComponentStack')}
            </Heading>
            <pre>{sliceErrorStack(errorInfo?.componentStack)}</pre>
          </details>
        </Stack>
      </AlertDescription>
    </Alert>
  )
}

export default AppErrorFallback
