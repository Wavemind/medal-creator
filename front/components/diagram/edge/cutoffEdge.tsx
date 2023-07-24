/**
 * The external imports
 */
import React, { FC, useCallback, useContext } from 'react'
import { Box, Button } from '@chakra-ui/react'
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
import { ModalContext } from '@/lib/contexts'
import { useGetConditionQuery } from '@/lib/api/modules'
import { DiagramService } from '@/lib/services'

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

  const { data: condition } = useGetConditionQuery({ id })

  const { open: openModal } = useContext(ModalContext)

  const handleClick = useCallback(() => {
    openModal({
      content: <ConditionForm conditionId={id} />,
      size: '5xl',
    })
  }, [])

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
          {condition && (condition.cutOffStart || condition.cutOffEnd) ? (
            <Box
              as='button'
              bg='white'
              cursor='pointer'
              fontSize='lg'
              color='primary'
              py={2}
              onClick={handleClick}
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
            <Button variant='diagram' onClick={handleClick}>
              +
            </Button>
          )}
        </Box>
      </EdgeLabelRenderer>
    </>
  )
}

export default CutoffEdge
