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
