/**
 * The external imports
 */
import { ReactElement, useEffect, useState } from 'react'
import { Flex, VStack } from '@chakra-ui/react'
import { serverSideTranslations } from 'next-i18next/serverSideTranslations'
import { ReactFlowProvider } from 'reactflow'
import { useTranslation } from 'next-i18next'
import { skipToken } from '@reduxjs/toolkit/dist/query'
import type { GetServerSidePropsContext } from 'next'
import type { Node, Edge } from 'reactflow'
import 'reactflow/dist/base.css'

/**
 * The internal imports
 */
import { apiGraphql } from '@/lib/api/apiGraphql'
import DiagramLayout from '@/lib/layouts/diagram'
import { getComponents } from '@/lib/api/modules/enhanced/instance.enhanced'
import {
  getDecisionTree,
  useGetDecisionTreeQuery,
} from '@/lib/api/modules/enhanced/decisionTree.enhanced'
import {
  getDiagnosis,
  useGetDiagnosisQuery,
} from '@/lib/api/modules/enhanced/diagnosis.enhanced'
import {
  getQuestionsSequence,
  useGetQuestionsSequenceQuery,
} from '@/lib/api/modules/enhanced/questionSequences.enhanced'
import { useGetAlgorithmQuery } from '@/lib/api/modules/enhanced/algorithm.enhanced'
import { wrapper } from '@/lib/store'
import DiagramWrapper from '@/components/diagram'
import Page from '@/components/page'
import DiagramSideBar from '@/components/diagram/diagramSideBar'
import DiagramWrapperHeader from '@/components/diagram/header/wrapper'
import DiagramService from '@/lib/services/diagram.service'
import PaginationFilterProvider from '@/lib/providers/paginationFilter'
import { extractTranslation } from '@/lib/utils/string'
import DiagramProvider from '@/lib/providers/diagram'
import { useProject } from '@/lib/hooks/useProject'
import {
  DiagramEnum,
  type DiagramPage,
  type InstantiatedNode,
  type AvailableNode as AvailableNodeType,
  type EdgeData,
  AlgorithmStatusEnum,
} from '@/types'

export default function Diagram({
  instanceableId,
  diagramType,
  initialEdges,
  initialNodes,
}: DiagramPage) {
  const { t } = useTranslation('diagram')

  const { projectLanguage } = useProject()
  const [title, setTitle] = useState('')
  const [isRestricted, setIsRestricted] = useState(false)

  const { data: decisionTree, isSuccess: isGetDecisionTreeSuccess } =
    useGetDecisionTreeQuery(
      diagramType === DiagramEnum.DecisionTree
        ? { id: instanceableId }
        : skipToken
    )

  const { data: diagnosis, isSuccess: isGetDiagnosisSuccess } =
    useGetDiagnosisQuery(
      diagramType === DiagramEnum.Diagnosis ? { id: instanceableId } : skipToken
    )

  const { data: questionsSequence, isSuccess: isGetQuestionsSequenceSuccess } =
    useGetQuestionsSequenceQuery(
      [
        DiagramEnum.QuestionsSequence,
        DiagramEnum.QuestionsSequenceScored,
      ].includes(diagramType)
        ? { id: instanceableId }
        : skipToken
    )

  const { data: algorithm, isSuccess: isGetAlgorithmSuccess } =
    useGetAlgorithmQuery(
      diagramType === DiagramEnum.Algorithm ? { id: instanceableId } : skipToken
    )

  useEffect(() => {
    if (isGetDecisionTreeSuccess) {
      setTitle(
        extractTranslation(decisionTree.labelTranslations, projectLanguage)
      )
      setIsRestricted(
        [AlgorithmStatusEnum.Prod, AlgorithmStatusEnum.Archived].includes(
          decisionTree.algorithm.status
        )
      )
    }
    if (isGetDiagnosisSuccess) {
      setTitle(extractTranslation(diagnosis.labelTranslations, projectLanguage))
      setIsRestricted(diagnosis.isDeployed)
    }
    if (isGetQuestionsSequenceSuccess) {
      setTitle(
        extractTranslation(questionsSequence.labelTranslations, projectLanguage)
      )
      setIsRestricted(questionsSequence.isDeployed)
    }
    if (isGetAlgorithmSuccess) {
      setTitle(algorithm.name)
      setIsRestricted(
        [AlgorithmStatusEnum.Prod, AlgorithmStatusEnum.Archived].includes(
          algorithm.status
        )
      )
    }
  }, [
    isGetDiagnosisSuccess,
    isGetDecisionTreeSuccess,
    isGetQuestionsSequenceSuccess,
    isGetAlgorithmSuccess,
  ])

  return (
    <Page
      title={t('title', {
        name: title,
      })}
    >
      <ReactFlowProvider>
        <DiagramProvider diagramType={diagramType} isRestricted={isRestricted}>
          <Flex flex={1}>
            <PaginationFilterProvider<AvailableNodeType>>
              <DiagramSideBar />
            </PaginationFilterProvider>
            <VStack w='full'>
              <DiagramWrapperHeader />
              <DiagramWrapper
                initialNodes={initialNodes}
                initialEdges={initialEdges}
              />
            </VStack>
          </Flex>
        </DiagramProvider>
      </ReactFlowProvider>
    </Page>
  )
}

Diagram.getLayout = function getLayout(page: ReactElement) {
  return <DiagramLayout>{page}</DiagramLayout>
}

export const getServerSideProps = wrapper.getServerSideProps(
  store =>
    async ({ locale, query }: GetServerSidePropsContext) => {
      const { instanceableType, instanceableId } = query

      if (
        typeof locale === 'string' &&
        typeof instanceableId === 'string' &&
        typeof instanceableType === 'string'
      ) {
        const diagramType =
          DiagramService.getInstanceableTypeFromUrl(instanceableType)
        if (diagramType && instanceableId) {
          if (diagramType === DiagramEnum.DecisionTree) {
            store.dispatch(getDecisionTree.initiate({ id: instanceableId }))
          }

          if (diagramType === DiagramEnum.Diagnosis) {
            store.dispatch(getDiagnosis.initiate({ id: instanceableId }))
          }

          if (
            [
              DiagramEnum.QuestionsSequence,
              DiagramEnum.QuestionsSequenceScored,
            ].includes(diagramType)
          ) {
            store.dispatch(
              getQuestionsSequence.initiate({ id: instanceableId })
            )
          }

          const getComponentsResponse = await store.dispatch(
            getComponents.initiate({
              instanceableId,
              instanceableType: diagramType,
            })
          )
          await Promise.all(
            store.dispatch(apiGraphql.util.getRunningQueriesThunk())
          )

          if (getComponentsResponse.isSuccess) {
            const initialNodes: Node<InstantiatedNode>[] = []
            const initialEdges: Edge<EdgeData>[] = []

            getComponentsResponse.data.forEach(component => {
              const type = DiagramService.getDiagramNodeType(
                component.node.category
              )

              // Setup initial nodes
              initialNodes.push({
                id: component.node.id,
                deletable: component.node.id !== instanceableId, // Can't delete QS in it's own diagram
                data: {
                  id: component.node.id,
                  fullReference: component.node.fullReference,
                  instanceId: component.id,
                  category: component.node.category,
                  isNeonat: component.node.isNeonat,
                  excludingNodes: component.node.excludingNodes,
                  labelTranslations: component.node.labelTranslations,
                  isDefault: component.node.isDefault,
                  diagramAnswers:
                    component.node.id === instanceableId
                      ? [] // Don't display answer of QS in it's own diagram
                      : component.node.diagramAnswers,
                  minScore: component.node.minScore,
                },
                position: { x: component.positionX, y: component.positionY },
                type,
              })

              // Setup initial edges
              component.conditions.forEach(condition => {
                initialEdges.push({
                  id: condition.id,
                  source: condition.answer.nodeId,
                  sourceHandle: condition.answer.id,
                  target: component.node.id,
                  type: condition.score === null ? 'cutoff' : 'score',
                  data:
                    condition.score === null
                      ? {
                          cutOffStart: condition.cutOffStart,
                          cutOffEnd: condition.cutOffEnd,
                        }
                      : { score: condition.score },
                })
              })

              // Diagnosis exclusion edges
              if (type === 'diagnosis') {
                component.node.excludingNodes.forEach(excludingNode => {
                  initialEdges.push({
                    id: `${excludingNode.id}-${component.node.id}`,
                    source: excludingNode.id,
                    sourceHandle: `${excludingNode.id}-left`,
                    target: component.node.id,
                    targetHandle: `${component.node.id}-right`,
                    type: 'exclusion',
                  })
                })
              }
            })

            // Translations
            const translations = await serverSideTranslations(locale, [
              'common',
              'projects',
              'algorithms',
              'diagram',
              'decisionTrees',
              'variables',
              'datatable',
              'diagnoses',
              'questionsSequence',
              'managements',
              'drugs',
              'instances',
              'formulations',
            ])

            return {
              props: {
                instanceableId,
                initialNodes,
                initialEdges,
                diagramType,
                ...translations,
              },
            }
          }
          return {
            notFound: true,
          }
        }
        return {
          redirect: {
            destination: '/500',
            permanent: false,
          },
        }
      }
      return {
        redirect: {
          destination: '/500',
          permanent: false,
        },
      }
    }
)
