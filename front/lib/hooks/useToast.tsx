/**
 * The external imports
 */
import { useState, useEffect, useRef } from 'react'
import {
  useToast as useChakraToast,
  Text,
  HStack,
  CloseButton,
  ToastId,
} from '@chakra-ui/react'

/**
 * The internal imports
 */
import { WarningIcon, CheckIcon } from '@/assets/icons'
import type { Toast } from '@/types'

export const useToast = () => {
  const [state, newToast] = useState<Toast | undefined>(undefined)
  const toast = useChakraToast()
  const toastIdRef = useRef<ToastId | null>(null)

  const renderIcon = () => {
    if (state) {
      const { status } = state
      switch (status) {
        case 'success':
          return <CheckIcon color={status} boxSize={5} />
        case 'warning':
        case 'error':
          return <WarningIcon color={status} boxSize={5} />
      }
    }
  }

  const closeToast = () => {
    if (toastIdRef.current) {
      toast.close(toastIdRef.current)
    }
  }

  useEffect(() => {
    if (state) {
      const { message, status } = state

      toastIdRef.current = toast({
        render: () => {
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
