/**
 * The external imports
 */
import React, { type FC, useState } from 'react'
import {
  Controls as DiagramControls,
  MiniMap,
  ControlButton,
  useReactFlow,
  getNodesBounds,
  getViewportForBounds,
} from 'reactflow'
import { TbMap, TbMapOff } from 'react-icons/tb'
import { RiScreenshot2Fill } from 'react-icons/ri'
import { toPng } from 'html-to-image'

/**
 * The internal imports
 */
import { useProject } from '@/lib/hooks'
import DiagramService from '@/lib/services/diagram.service'

const Controls: FC = () => {
  const { getNodes } = useReactFlow()

  const [showMinimap, setShowMinimap] = useState(true)

  const { isAdminOrClinician } = useProject()

  const toggleMinimap = () => {
    setShowMinimap(!showMinimap)
  }

  const downloadImage = () => {
    const nodesBounds = getNodesBounds(getNodes())
    const imageWidth = 1024
    const imageHeight = 768

    const transform = getViewportForBounds(
      nodesBounds,
      imageWidth,
      imageHeight,
      0,
      2
    )

    toPng(document.querySelector('.react-flow__viewport') as HTMLElement, {
      filter: node =>
        !(
          node?.classList?.contains('react-flow__minimap') ||
          node?.classList?.contains('react-flow__controls')
        ),
      backgroundColor: '#fff',
      width: imageWidth,
      height: imageHeight,
      style: {
        transform: `translate(${transform.x}px, ${transform.y}px) scale(${transform.zoom})`,
      },
    }).then(dataUrl => {
      const a = document.createElement('a')

      a.setAttribute('download', `${window.document.title}.png`)
      a.setAttribute('href', dataUrl)
      a.click()
    })
  }

  return (
    <React.Fragment>
      <DiagramControls showInteractive={isAdminOrClinician}>
        <ControlButton onClick={toggleMinimap}>
          {showMinimap ? <TbMapOff /> : <TbMap />}
        </ControlButton>
        <ControlButton onClick={downloadImage}>
          <RiScreenshot2Fill />
        </ControlButton>
      </DiagramControls>
      {showMinimap && <MiniMap nodeColor={DiagramService.getNodeColorByType} />}
    </React.Fragment>
  )
}

export default Controls
