/**
 * The external imports
 */
import React, { useEffect, useRef } from 'react'
import { useTranslation } from 'next-i18next'
import { useFormContext } from 'react-hook-form'
import {
  Popover,
  PopoverContent,
  PopoverHeader,
  PopoverBody,
  PopoverFooter,
  PopoverArrow,
  PopoverCloseButton,
  PopoverAnchor,
  useDisclosure,
  Button,
  ButtonGroup,
  Box,
  Portal,
} from '@chakra-ui/react'
import type { FC, KeyboardEvent } from 'react'

/**
 * The internal imports
 */
import FormulaInformation from '@/components/drawer/formulaInformation'
import Input from '@/components/inputs/input'
import { DISPLAY_FORMULA_ANSWER_TYPE } from '@/lib/config/constants'

const Formula: FC = () => {
  const { t } = useTranslation('variables')

  const { isOpen, onToggle, onClose, onOpen } = useDisclosure()

  const modalRef = useRef<HTMLDivElement | null>(null)

  const { watch, setValue, getValues } = useFormContext()
  const watchAnswerTypeId: string = watch('answerTypeId')

  useEffect(() => {
    if (
      !DISPLAY_FORMULA_ANSWER_TYPE.includes(parseInt(watchAnswerTypeId)) &&
      getValues('formula')
    ) {
      setValue('formula', undefined)
    }
  }, [watchAnswerTypeId])

  useEffect(() => {
    const detectSlash = (e: unknown) => {
      const keyboardEvent = e as KeyboardEvent<Document>

      if (keyboardEvent.key === '/') {
        onOpen()
      }
    }

    document.addEventListener('keydown', detectSlash)

    return () => {
      document.removeEventListener('keydown', detectSlash)
    }
  }, [])

  useEffect(() => {
    const modal = document.querySelector('[role="dialog"]')
    modalRef.current = modal
  }, [])

  if (DISPLAY_FORMULA_ANSWER_TYPE.includes(parseInt(watchAnswerTypeId))) {
    return (
      <>
        <Popover
          returnFocusOnClose={false}
          isOpen={isOpen}
          onClose={onClose}
          placement='right'
          closeOnBlur={false}
          isLazy
          lazyBehavior='keepMounted'
        >
          <PopoverAnchor>
            <Input
              label={t('formula')}
              type='formula'
              name='formula'
              isRequired
              hasDrawer
              drawerContent={<FormulaInformation />}
              drawerTitle={t('formulaInformation.formulaTooltipTitle')}
            />
          </PopoverAnchor>
          <Portal containerRef={modalRef}>
            <Box
              sx={{
                '& .chakra-popover__popper': {
                  zIndex: 'popover',
                },
              }}
            >
              <PopoverContent>
                <PopoverHeader fontWeight='semibold'>
                  Confirmation
                </PopoverHeader>
                <PopoverArrow />
                <PopoverCloseButton />
                <PopoverBody>
                  Are you sure you want to continue with your action?
                </PopoverBody>
                <PopoverFooter display='flex' justifyContent='flex-end'>
                  <ButtonGroup size='sm'>
                    <Button variant='outline'>Cancel</Button>
                    <Button colorScheme='red'>Apply</Button>
                  </ButtonGroup>
                </PopoverFooter>
              </PopoverContent>
            </Box>
          </Portal>
        </Popover>
      </>
    )
  }

  return null
}

export default Formula
