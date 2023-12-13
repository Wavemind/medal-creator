/**
 * The external imports
 */
import { type FC, useState } from 'react'
import {
  Box,
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
import ScoreForm from '@/components/forms/score'
import type { ScoreEdgeData } from '@/types'
import { useDiagram } from '@/lib/hooks/useDiagram'

const ScoreEdge: FC<EdgeProps> = ({
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
  const { isEditable } = useDiagram()
  const { t } = useTranslation('diagram')
  const [isHover, setIsHover] = useState(false)
  const { getEdges, setEdges } = useReactFlow()
  const { onOpen, onClose, isOpen } = useDisclosure()

  const updateScore = (data: ScoreEdgeData) => {
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
        style={{ ...style, strokeWidth: isHover ? 3 : 2 }}
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
            isOpen={isEditable ? isOpen : false}
            onOpen={onOpen}
            onClose={onClose}
            placement='right'
            closeOnBlur={true}
            isLazy
          >
            <Tooltip
              label={t('updateScore')}
              placement='left'
              isDisabled={!isEditable}
            >
              <Box
                display='inline-block'
                className='cut-off-wrapper'
                onMouseEnter={() => setIsHover(true)}
                onMouseLeave={() => setIsHover(false)}
              >
                <PopoverTrigger>
                  <Box
                    role='button'
                    bg='white'
                    cursor={isEditable ? 'pointer' : 'default'}
                    fontSize='lg'
                    color='primary'
                    py={2}
                    px={4}
                    borderRadius='full'
                    transitionDuration='0.5s'
                    borderWidth={1}
                    borderColor='primary'
                    _hover={{
                      boxShadow: 'lg',
                    }}
                  >
                    {data.score}
                  </Box>
                </PopoverTrigger>
              </Box>
            </Tooltip>
            <Portal>
              <PopoverContent p={5}>
                <FocusLock restoreFocus persistentFocus={false}>
                  <PopoverArrow />
                  <PopoverCloseButton />
                  <ScoreForm
                    conditionId={id}
                    close={onClose}
                    callback={updateScore}
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

export default ScoreEdge
