import { AvailableNode } from './diagram'

export type Instance = {
  id: number
  diagramName: string
  instanceableType: string
  instanceableId: number
  diagnosisId: number
}

export type InstanceInput = {
  nodeId: string
  instanceableId: string
  instanceableType: string
  positionX: number
  positionY: number
}

export type Component = {
  id: string
  positionX: number
  positionY: number
  conditions: {
    id: string
    answer: {
      id: string
    }
    parentInstance: {
      id: string
    }
    cutOffStart: number
    cutOffEnd: number
    score: number
  }[]
  node: AvailableNode
}
