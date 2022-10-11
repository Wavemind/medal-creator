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

const AppErrorFallback = ({ error, errorInfo, resetErrorBoundary }) => {
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
        An Error Occurred
      </AlertTitle>
      <AlertDescription>
        <Stack spacing={8}>
          <Box>
            <Text>
              The application detected an error, and it's been reported to the
              application development team. You can try clicking "Reload the
              Page" to return to the page you were on previously.
            </Text>
            <Text>
              If the error keeps occurring, please file a bug report with the
              following details, and include any steps to reproduce the issue:
            </Text>
          </Box>

          <Button onClick={resetErrorBoundary}>Reload the Page</Button>

          <Heading as='h2' size='lg'>
            Error Details
          </Heading>
          <Heading as='h3' size='md'>
            Message
          </Heading>
          <pre>{error.message}</pre>
          <details>
            <summary>Expand to Show Error Stack Traces</summary>
            <Heading as='h4' size='sm' my={4}>
              Stack Trace
            </Heading>
            <pre>{sliceErrorStack(error.stack)}</pre>
            <Heading as='h4' size='sm' my={4}>
              Component Stack
            </Heading>
            <pre>{sliceErrorStack(errorInfo?.componentStack)}</pre>
          </details>
        </Stack>
      </AlertDescription>
    </Alert>
  )
}

export default AppErrorFallback
