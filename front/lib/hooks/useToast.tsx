/**
 * The external imports
 */
import { useState, useEffect, useRef } from 'react'
import { useToast, Text, HStack, CloseButton, ToastId } from '@chakra-ui/react'

/**
 * The internal imports
 */
import { WarningIcon, CheckIcon } from '@/assets/icons'
import type { Toast } from '@/types/hooks'

export default () => {
  const [state, newToast] = useState<Toast | undefined>(undefined)
  const toast = useToast()
  const toastIdRef = useRef<ToastId | null>(null)

  useEffect(() => {
    if (state) {
      const { message, status } = state

      toastIdRef.current = toast({
        render: () => {
          // Renders the correct icon based on status
          const renderIcon = () => {
            switch (status) {
              case 'success':
                return <CheckIcon color={status} boxSize={5} />
              case 'error':
                return <WarningIcon color={status} boxSize={5} />
            }
          }

          // Closes the toast
          const closeToast = () => {
            toast.close(toastIdRef.current as ToastId)
          }

          return (
            <HStack
              boxShadow='0px 2px 5px 0px #00000040'
              borderStartWidth={14}
              borderStartColor={status}
              justifyContent='space-between'
              px={3}
              py={4}
              bg='white'
            >
              <HStack spacing={2}>
                {renderIcon()}
                <Text color={status} fontWeight='bold'>
                  {message}
                </Text>
              </HStack>
              <CloseButton onClick={closeToast} />
            </HStack>
          )
        },
        duration: 9000,
        position: 'bottom-right',
      })
    }
  }, [state, toast])

  return { state, newToast }
}
