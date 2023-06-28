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
import { getProject } from '@/lib/api/modules'
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

          const initialNodes: Node<AvailableNode>[] = []

          for (let i = 0; i <= 15; i++) {
            const answers = []
            for (let i = 0; i <= Math.floor(Math.random() * 6) + 1; i++) {
              const newAnswer = {
                id: String(Math.random() * 100),
                labelTranslations: { en: 'Yes', fr: 'Oui' },
              }
              answers.push(newAnswer)
            }

            const newNode: Node<AvailableNode> = {
              id: String(Math.random() * 100),
              data: {
                id: String(Math.random() * 100),
                category: 'PhysicalExam',
                labelTranslations: {
                  fr: `Tchoutchou ${i}`,
                  en: `Tchoutchou ${i}`,
                },
                diagramAnswers: answers,
              },
              position: { x: i * 200, y: i * 200 },
              type: 'variable',
            }

            initialNodes.push(newNode)
          }

          initialNodes.push({
            id: String(Math.random() * 100),
            data: {
              id: String(Math.random() * 100),
              category: 'PredefinedSyndrome',
              labelTranslations: {
                en: 'Complicated cellulitis',
                fr: 'Complicated cellulitis en FR',
              },
              diagramAnswers: [
                {
                  id: String(Math.random() * 100),
                  labelTranslations: { en: 'Yes', fr: 'Oui' },
                },
                {
                  id: String(Math.random() * 100),
                  labelTranslations: { en: 'No', fr: 'Non' },
                },
              ],
            },
            position: { x: 100, y: 300 },
            type: 'medicalCondition',
          })

          initialNodes.push({
            id: String(Math.random() * 100),
            data: {
              id: String(Math.random() * 100),
              labelTranslations: { en: 'Malaria', fr: 'Malaria' },
              category: 'Treatment',
              diagramAnswers: [],
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
