/**
 * The external imports
 */
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
  useReactFlow,
} from 'reactflow'
import { useTranslation } from 'next-i18next'

/**
 * The internal imports
 */
import ConditionForm from '@/components/forms/condition'
import DiagramService from '@/lib/services/diagram.service'
import AddIcon from '@/assets/icons/Add'
import type { CutOffEdgeData } from '@/types'
import { FC, useState } from 'react'

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
  data = {},
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
  const [isHover, setIsHover] = useState(false)

  const { getEdges, setEdges } = useReactFlow()
  const { onOpen, onClose, isOpen } = useDisclosure()

  const updateCutOff = (data: CutOffEdgeData) => {
    const edges = getEdges()
    const currentEdgeIndex = edges.findIndex(edge => edge.id === id)

    if (currentEdgeIndex !== -1) {
      const currentEdge = { ...edges[currentEdgeIndex] }
      currentEdge.data = data
      const updatedEdges = [...edges]
      updatedEdges[currentEdgeIndex] = currentEdge
      setEdges(updatedEdges)
    }
  }

  return (
    <>
      <BaseEdge
        path={edgePath}
        markerEnd={markerEnd}
        style={{ strokeWidth: isHover ? 3 : 1, ...style }}
      />
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
              isDisabled={!!data.cutOffStart || !!data.cutOffEnd}
            >
              <Box
                display='inline-block'
                className='cut-off-wrapper'
                onMouseEnter={() => setIsHover(true)}
                onMouseLeave={() => setIsHover(false)}
              >
                <PopoverTrigger>
                  {data.cutOffStart || data.cutOffEnd ? (
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
                      {t('cutOffDisplay', {
                        cutOffStart: DiagramService.readableDate(
                          data.cutOffStart || 0,
                          t
                        ),
                        cutOffEnd: DiagramService.readableDate(
                          data.cutOffEnd || 5479,
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
                  <ConditionForm
                    conditionId={id}
                    close={onClose}
                    callback={updateCutOff}
                  />
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
