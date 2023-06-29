/**
 * The external imports
 */

import { Flex } from '@chakra-ui/react'
import { serverSideTranslations } from 'next-i18next/serverSideTranslations'
import { ReactFlowProvider } from 'reactflow'
import type { GetServerSidePropsContext } from 'next'
import type { ReactElement } from 'react'
import type { Node } from 'reactflow'
import { useTranslation } from 'next-i18next'
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
  diagramType,
}: {
  initialNodes: Node<AvailableNode>[]
  diagramType: DiagramType
}) {
  const { t } = useTranslation('diagram')

  return (
    <Page title={t('title')}>
      <Flex h='85vh'>
        <ReactFlowProvider>
          <DiagramWrapper
            initialNodes={initialNodes}
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
            console.log(getComponentsResponse.data)
            const initialNodes: Node<AvailableNode>[] = []

            getComponentsResponse.data.forEach(component => {
              console.log(component.node.diagramAnswers)
              initialNodes.push({
                id: component.id,
                data: {
                  id: String(Math.random() * 100),
                  category: component.node.category,
                  labelTranslations: component.node.labelTranslations,
                  diagramAnswers: component.node.diagramAnswers,
                },
                position: { x: component.positionX, y: component.positionY },
                type: DiagramService.getDiagramNodeType(
                  component.node.category
                ),
              })
            })

            return {
              props: {
                projectId,
                initialNodes,
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
