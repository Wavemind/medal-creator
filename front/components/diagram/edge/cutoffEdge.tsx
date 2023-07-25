/**
 * The external imports
 */
import { type FC } from 'react'
import {
  Box,
  Button,
  FocusLock,
  Popover,
  PopoverArrow,
  PopoverCloseButton,
  PopoverContent,
  PopoverTrigger,
  Portal,
  Tooltip,
  useDisclosure,
} from '@chakra-ui/react'
import {
  BaseEdge,
  EdgeLabelRenderer,
  EdgeProps,
  getBezierPath,
} from 'reactflow'
import { useTranslation } from 'next-i18next'

/**
 * The internal imports
 */
import { ConditionForm } from '@/components'
import { useGetConditionQuery } from '@/lib/api/modules'
import { DiagramService } from '@/lib/services'
import { AddIcon } from '@/assets/icons'

const CutoffEdge: FC<EdgeProps> = ({
  id,
  sourceX,
  sourceY,
  targetX,
  targetY,
  sourcePosition,
  targetPosition,
  style = {},
  markerEnd,
}) => {
  const [edgePath, labelX, labelY] = getBezierPath({
    sourceX,
    sourceY,
    sourcePosition,
    targetX,
    targetY,
    targetPosition,
  })
  const { t } = useTranslation('diagram')

  const { onOpen, onClose, isOpen } = useDisclosure()

  const { data: condition } = useGetConditionQuery({ id })

  return (
    <>
      <BaseEdge path={edgePath} markerEnd={markerEnd} style={style} />
      <EdgeLabelRenderer>
        <Box
          position='absolute'
          transform={`translate(-50%, -50%) translate(${labelX}px,${labelY}px)`}
          // everything inside EdgeLabelRenderer has no pointer events by default
          // if you have an interactive element, set pointer-events: all
          pointerEvents='all'
          className='nodrag nopan'
        >
          <Popover
            isOpen={isOpen}
            onOpen={onOpen}
            onClose={onClose}
            placement='right'
            closeOnBlur={true}
            isLazy
          >
            <Tooltip
              label={t('addCutoffs')}
              placement='left'
              isDisabled={
                !!condition &&
                (!!condition.cutOffStart || !!condition.cutOffEnd)
              }
            >
              <Box display='inline-block'>
                <PopoverTrigger>
                  {condition &&
                  (condition.cutOffStart || condition.cutOffEnd) ? (
                    <Box
                      role='button'
                      bg='white'
                      cursor='pointer'
                      fontSize='lg'
                      color='primary'
                      py={2}
                      px={4}
                      borderRadius={10}
                      transitionDuration='0.5s'
                      _hover={{
                        boxShadow: 'lg',
                      }}
                    >
                      {t('conditionLabel', {
                        cutOffStart: DiagramService.readableDate(
                          condition.cutOffStart || 0,
                          t
                        ),
                        cutOffEnd: DiagramService.readableDate(
                          condition?.cutOffEnd || 5479,
                          t
                        ),
                      })}
                    </Box>
                  ) : (
                    <Button variant='diagram'>
                      <AddIcon />
                    </Button>
                  )}
                </PopoverTrigger>
              </Box>
            </Tooltip>
            <Portal>
              <PopoverContent p={5}>
                <FocusLock restoreFocus persistentFocus={false}>
                  <PopoverArrow />
                  <PopoverCloseButton />
                  <ConditionForm conditionId={id} close={onClose} />
                </FocusLock>
              </PopoverContent>
            </Portal>
          </Popover>
        </Box>
      </EdgeLabelRenderer>
    </>
  )
}

export default CutoffEdge
