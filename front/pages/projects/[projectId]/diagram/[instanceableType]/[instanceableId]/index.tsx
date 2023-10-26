/**
 * The external imports
 */
import { ReactElement, useMemo, useState } from 'react'
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
import { wrapper } from '@/lib/store'
import DiagramWrapper from '@/components/diagram'
import Page from '@/components/page'
import DiagramSideBar from '@/components/diagram/diagramSideBar'
import DiagramWrapperHeader from '@/components/diagram/header/wrapper'
import DiagramService from '@/lib/services/diagram.service'
import { useProject } from '@/lib/hooks'
import { extractTranslation } from '@/lib/utils/string'
import PaginationFilterProvider from '@/lib/providers/paginationFilter'
import {
  type DiagramPage,
  type InstantiatedNode,
  DiagramEnum,
  CutOffEdgeData,
  type AvailableNode as AvailableNodeType,
} from '@/types'

export default function Diagram({
  instanceableId,
  diagramType,
  initialEdges,
  initialNodes,
}: DiagramPage) {
  const { t } = useTranslation('diagram')

  const [refetch, setRefetch] = useState(false)

  const { projectLanguage } = useProject()

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

  const data = useMemo(() => {
    if (isGetDecisionTreeSuccess) {
      return decisionTree
    }
    if (isGetDiagnosisSuccess) {
      return diagnosis
    }
  }, [isGetDiagnosisSuccess, isGetDecisionTreeSuccess])

  return (
    <Page
      title={t('title', {
        name: extractTranslation(data?.labelTranslations, projectLanguage),
      })}
    >
      <ReactFlowProvider>
        <Flex flex={1}>
          <PaginationFilterProvider<AvailableNodeType>>
            <DiagramSideBar
              diagramType={diagramType}
              refetch={refetch}
              setRefetch={setRefetch}
            />
          </PaginationFilterProvider>
          <VStack w='full'>
            <DiagramWrapperHeader diagramType={diagramType} />
            <DiagramWrapper
              initialNodes={initialNodes}
              initialEdges={initialEdges}
              diagramType={diagramType}
              setRefetch={setRefetch}
            />
          </VStack>
        </Flex>
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
        const diagramType = DiagramService.getInstanceableType(instanceableType)
        if (diagramType && instanceableId) {
          if (diagramType === DiagramEnum.DecisionTree) {
            store.dispatch(getDecisionTree.initiate({ id: instanceableId }))
          }

          if (diagramType === DiagramEnum.Diagnosis) {
            store.dispatch(getDiagnosis.initiate({ id: instanceableId }))
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
            const initialEdges: Edge<CutOffEdgeData>[] = []

            getComponentsResponse.data.forEach(component => {
              const type = DiagramService.getDiagramNodeType(
                component.node.category
              )

              // Setup initial nodes
              initialNodes.push({
                id: component.node.id,
                data: {
                  id: component.node.id,
                  fullReference: component.node.fullReference,
                  instanceId: component.id,
                  category: component.node.category,
                  isNeonat: component.node.isNeonat,
                  excludingNodes: component.node.excludingNodes,
                  labelTranslations: component.node.labelTranslations,
                  diagramAnswers: component.node.diagramAnswers,
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
                  type: 'cutoff',
                  data: {
                    cutOffStart: condition.cutOffStart,
                    cutOffEnd: condition.cutOffEnd,
                  },
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
              'diagram',
              'decisionTrees',
              'variables',
              'datatable',
              'diagnoses',
              'questionsSequence',
              'managements',
              'drugs',
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
