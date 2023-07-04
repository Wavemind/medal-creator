/**
 * The external imports
 */

import { Flex } from '@chakra-ui/react'
import { serverSideTranslations } from 'next-i18next/serverSideTranslations'
import { ReactFlowProvider } from 'reactflow'
import { useTranslation } from 'next-i18next'
import { skipToken } from '@reduxjs/toolkit/dist/query'
import type { GetServerSidePropsContext } from 'next'
import type { ReactElement } from 'react'
import type { Node, Edge } from 'reactflow'
import 'reactflow/dist/base.css'

/**
 * The internal imports
 */
import { apiGraphql } from '@/lib/api/apiGraphql'
import {
  getComponents,
  getDecisionTree,
  getProject,
  useGetDecisionTreeQuery,
} from '@/lib/api/modules'
import Layout from '@/lib/layouts/default'
import { wrapper } from '@/lib/store'
import { DiagramWrapper, Page, DiagramSideBar } from '@/components'
import { DiagramService } from '@/lib/services'
import { DiagramTypeEnum } from '@/lib/config/constants'
import type { AvailableNode, DiagramPage } from '@/types'

export default function Diagram({
  initialNodes,
  initialEdges,
  diagramType,
  instanceableId,
}: DiagramPage) {
  const { t } = useTranslation('diagram')

  const { data: decisionTree } = useGetDecisionTreeQuery(
    diagramType === DiagramTypeEnum.DecisionTree ? instanceableId : skipToken
  )

  return (
    <Page title={t('title')}>
      <Flex h='85vh'>
        <ReactFlowProvider>
          <DiagramWrapper
            initialNodes={initialNodes}
            initialEdges={initialEdges}
            diagramType={diagramType}
          />
          <DiagramSideBar diagramType={diagramType} />
        </ReactFlowProvider>
      </Flex>
    </Page>
  )
}

Diagram.getLayout = function getLayout(page: ReactElement) {
  return <Layout>{page}</Layout>
}

export const getServerSideProps = wrapper.getServerSideProps(
  store =>
    async ({ locale, query }: GetServerSidePropsContext) => {
      const { projectId, instanceableType, instanceableId } = query

      if (
        typeof locale === 'string' &&
        typeof instanceableId === 'string' &&
        typeof instanceableType === 'string'
      ) {
        const diagramType = DiagramService.getInstanceableType(instanceableType)
        if (diagramType && instanceableId) {
          store.dispatch(getProject.initiate(Number(projectId)))

          if (diagramType === DiagramTypeEnum.DecisionTree) {
            store.dispatch(getDecisionTree.initiate(Number(instanceableId)))
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
            const initialNodes: Node<AvailableNode>[] = []
            const initialEdges: Edge[] = []

            getComponentsResponse.data.forEach(component => {
              const type = DiagramService.getDiagramNodeType(
                component.node.category
              )

              // Setup initial nodes
              initialNodes.push({
                id: component.node.id,
                data: {
                  id: component.node.id,
                  instanceableId: component.id,
                  category: component.node.category,
                  isNeonat: component.node.isNeonat,
                  excludingNodes: component.node.excludingNodes,
                  labelTranslations: component.node.labelTranslations,
                  diagramAnswers: component.node.diagramAnswers,
                },
                position: { x: component.positionX, y: component.positionY },
                type,
              })

              // Variable links
              component.conditions.forEach(condition => {
                initialEdges.push({
                  id: condition.id,
                  source: condition.answer.nodeId,
                  sourceHandle: condition.answer.id,
                  target: component.node.id,
                })
              })

              // Diagnosis exclusion links
              if (type === 'diagnosis') {
                component.node.excludingNodes.forEach(excludingNode => {
                  initialEdges.push({
                    id: excludingNode.id,
                    source: excludingNode.id,
                    sourceHandle: `${excludingNode.id}-left`,
                    target: component.node.id,
                    targetHandle: `${component.node.id}-right`,
                    animated: true,
                  })
                })
              }
            })

            // Translations
            const translations = await serverSideTranslations(locale, [
              'common',
              'projects',
              'diagram',
              'variables',
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
