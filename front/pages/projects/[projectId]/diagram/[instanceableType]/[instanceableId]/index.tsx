/**
 * The external imports
 */

import { Flex } from '@chakra-ui/react'
import { serverSideTranslations } from 'next-i18next/serverSideTranslations'
import { ReactFlowProvider } from 'reactflow'
import { useTranslation } from 'next-i18next'
import type { GetServerSidePropsContext } from 'next'
import type { ReactElement } from 'react'
import type { Node, Edge } from 'reactflow'
import 'reactflow/dist/base.css'

/**
 * The internal imports
 */
import { apiGraphql } from '@/lib/api/apiGraphql'
import { getComponents, getProject } from '@/lib/api/modules'
import Layout from '@/lib/layouts/default'
import { wrapper } from '@/lib/store'
import { DiagramWrapper, Page, DiagramSideBar } from '@/components'
import { DiagramService } from '@/lib/services'
import { DiagramType } from '@/lib/config/constants'
import type { AvailableNode } from '@/types'

export default function Diagram({
  initialNodes,
  initialEdges,
  diagramType,
}: {
  initialNodes: Node<AvailableNode>[]
  diagramType: DiagramType
  initialEdges: Edge[]
}) {
  const { t } = useTranslation('diagram')

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

      if (typeof locale === 'string') {
        const diagramType = DiagramService.getInstanceableType(instanceableType)
        if (diagramType && instanceableId) {
          store.dispatch(getProject.initiate(Number(projectId)))
          const getComponentsResponse = await store.dispatch(
            getComponents.initiate({
              instanceableId,
              instanceableType: diagramType,
            })
          )

          await Promise.all(
            store.dispatch(apiGraphql.util.getRunningQueriesThunk())
          )

          // Translations
          const translations = await serverSideTranslations(locale, [
            'common',
            'projects',
            'diagram',
            'variables',
          ])

          if (getComponentsResponse.isSuccess) {
            const initialNodes: Node<AvailableNode>[] = []
            const initialEdges: Edge[] = []

            getComponentsResponse.data.forEach(component => {
              // Setup initial nodes
              initialNodes.push({
                id: component.id,
                data: {
                  id: component.id,
                  category: component.node.category,
                  labelTranslations: component.node.labelTranslations,
                  diagramAnswers: component.node.diagramAnswers,
                },
                position: { x: component.positionX, y: component.positionY },
                type: DiagramService.getDiagramNodeType(
                  component.node.category
                ),
              })

              // Setup initial edges
              component.conditions.forEach(condition => {
                initialEdges.push({
                  id: condition.id,
                  source: condition.answerNode.id,
                  sourceHandle: condition.answer.id, // Seems correct
                  target: component.id, // Seems correct
                  animated: false, // TODO
                })
              })
            })

            return {
              props: {
                projectId,
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
