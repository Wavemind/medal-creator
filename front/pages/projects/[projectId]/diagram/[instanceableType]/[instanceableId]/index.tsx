/**
 * The external imports
 */
import { ReactElement } from 'react'
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
import {
  getComponents,
  getDecisionTree,
  getProject,
  useGetDecisionTreeQuery,
  useGetProjectQuery,
} from '@/lib/api/modules'
import { wrapper } from '@/lib/store'
import {
  DiagramWrapper,
  Page,
  DiagramSideBar,
  DiagramHeader,
} from '@/components'
import { DiagramService } from '@/lib/services'
import { extractTranslation } from '@/lib/utils'
import {
  type DiagramPage,
  type InstantiatedNode,
  DiagramEnum,
  CutOffEdgeData,
  AvailableNode as AvailableNodeType,
} from '@/types'
import PaginationFilterProvider from '@/lib/providers/paginationFilter'

export default function Diagram({
  projectId,
  instanceableId,
  diagramType,
  initialEdges,
  initialNodes,
}: DiagramPage) {
  const { t } = useTranslation('diagram')

  const { data: decisionTree } = useGetDecisionTreeQuery(
    diagramType === DiagramEnum.DecisionTree
      ? { id: instanceableId }
      : skipToken
  )

  const { data: project } = useGetProjectQuery({
    id: projectId,
  })

  return (
    <Page
      title={t('title', {
        name: extractTranslation(
          decisionTree?.labelTranslations,
          project?.language.code
        ),
      })}
    >
      <ReactFlowProvider>
        <Flex flex={1}>
          <PaginationFilterProvider<AvailableNodeType>>
            <DiagramSideBar diagramType={diagramType} />
          </PaginationFilterProvider>
          <VStack w='full'>
            <DiagramHeader diagramType={diagramType} />
            <DiagramWrapper
              initialNodes={initialNodes}
              initialEdges={initialEdges}
              diagramType={diagramType}
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
      const { projectId, instanceableType, instanceableId } = query
      if (
        typeof locale === 'string' &&
        typeof projectId === 'string' &&
        typeof instanceableId === 'string' &&
        typeof instanceableType === 'string'
      ) {
        const diagramType = DiagramService.getInstanceableType(instanceableType)
        if (diagramType && instanceableId) {
          store.dispatch(getProject.initiate({ id: projectId }))
          if (diagramType === DiagramEnum.DecisionTree) {
            store.dispatch(getDecisionTree.initiate({ id: instanceableId }))
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
            ])

            return {
              props: {
                projectId,
                instanceableId,
                initialNodes,
                initialEdges,
                diagramType,
                ...translations,
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
)
