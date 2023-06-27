import { DiagramType } from '../config/constants'

class Diagram {
  private static instance: Diagram

  public static getInstance(): Diagram {
    if (!Diagram.instance) {
      Diagram.instance = new Diagram()
    }
    return Diagram.instance
  }

  public getDiagramType = (type: string): DiagramType | null => {
    switch (type) {
      case 'decision-tree':
        return DiagramType.DecisionTree
      case 'algorithm':
        return DiagramType.Algorithm
      case 'node':
        return DiagramType.Node
      default:
        return null
    }
  }

  // public get
}

export const DiagramService = Diagram.getInstance()
