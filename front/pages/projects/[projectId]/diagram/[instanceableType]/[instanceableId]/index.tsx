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
import { getAvailableNodes, getProject } from '@/lib/api/modules'
import Layout from '@/lib/layouts/default'
import { wrapper } from '@/lib/store'
import { DiagramWrapper, Page, DiagramSideBar } from '@/components'
import { DiagramService } from '@/lib/services'
import { DiagramType } from '@/lib/config/constants'
import type { NodeData } from '@/types'

export default function Diagram({
  initialNodes,
  diagramType,
}: {
  initialNodes: Node<NodeData>[]
  diagramType: DiagramType
}) {
  const { t } = useTranslation('diagram')

  return (
    <Page title={t('title')}>
      <Flex h='85vh'>
        <ReactFlowProvider>
          <DiagramWrapper initialNodes={initialNodes} />
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
        const diagramType = DiagramService.getDiagramType(instanceableType)
        if (diagramType && instanceableId) {
          store.dispatch(getProject.initiate(Number(projectId)))
          store.dispatch(
            getAvailableNodes.initiate({
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
          ])

          const initialNodes: Node<NodeData>[] = []

          for (let i = 0; i <= 15; i++) {
            const answers = []
            for (let i = 0; i <= Math.floor(Math.random() * 6) + 1; i++) {
              const newAnswer = {
                id: String(Math.random() * 100),
                label: 'Yes',
              }
              answers.push(newAnswer)
            }

            const newNode: Node = {
              id: String(Math.random() * 100),
              data: {
                label: `Tchoutchou ${i}`,
                type: 'Category',
                answers: answers,
              },
              position: { x: i * 100, y: i * 100 },
              type: 'variable',
            }

            initialNodes.push(newNode)
          }

          initialNodes.push({
            id: String(Math.random() * 100),
            data: {
              label: `medicalConditions`,
              type: 'Category',
              answers: [
                {
                  id: String(Math.random() * 100),
                  label: 'Yes',
                },
                {
                  id: String(Math.random() * 100),
                  label: 'No',
                },
              ],
            },
            position: { x: 100, y: 300 },
            type: 'medicalCondition',
          })

          initialNodes.push({
            id: String(Math.random() * 100),
            data: {
              label: 'Malaria',
              type: 'Treatment',
              answers: [],
            },
            position: { x: 100, y: 300 },
            type: 'diagnosis',
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
