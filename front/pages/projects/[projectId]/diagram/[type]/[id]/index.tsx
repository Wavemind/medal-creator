/**
 * The external imports
 */

import { useState, useCallback } from 'react'
import { Flex, useConst } from '@chakra-ui/react'
import { serverSideTranslations } from 'next-i18next/serverSideTranslations'
import ReactFlow, {
  Controls,
  Background,
  applyNodeChanges,
  applyEdgeChanges,
  addEdge,
  MiniMap,
} from 'reactflow'
import type { GetServerSidePropsContext } from 'next'
import type { ReactElement } from 'react'
import type {
  Node,
  Edge,
  OnNodesChange,
  OnEdgesChange,
  OnConnect,
} from 'reactflow'
import { useTranslation } from 'next-i18next'
import 'reactflow/dist/base.css'

/**
 * The internal imports
 */
import { apiGraphql } from '@/lib/api/apiGraphql'
import { getProject } from '@/lib/api/modules'
import Layout from '@/lib/layouts/default'
import { wrapper } from '@/lib/store'
import { Page, VariableNode } from '@/components'

export default function Diagram({ initialNodes }) {
  const { t } = useTranslation('diagram')

  const [nodes, setNodes] = useState<Node[]>(initialNodes)
  const [edges, setEdges] = useState<Edge[]>([])

  const nodeTypes = useConst({ variable: VariableNode })

  const onNodesChange: OnNodesChange = useCallback(
    changes => setNodes(nds => applyNodeChanges(changes, nds)),
    []
  )
  const onEdgesChange: OnEdgesChange = useCallback(
    changes => setEdges(eds => applyEdgeChanges(changes, eds)),
    []
  )

  const onConnect: OnConnect = useCallback(
    params => setEdges(eds => addEdge(params, eds)),
    []
  )

  return (
    <Page title={t('title')}>
      <Flex h='85vh'>
        <ReactFlow
          nodes={nodes}
          onNodesChange={onNodesChange}
          edges={edges}
          fitView
          onEdgesChange={onEdgesChange}
          onConnect={onConnect}
          nodeTypes={nodeTypes}
        >
          <Background />
          <Controls />
          <MiniMap />
        </ReactFlow>
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
      const { projectId } = query

      if (typeof locale === 'string') {
        store.dispatch(getProject.initiate(Number(projectId)))
        await Promise.all(
          store.dispatch(apiGraphql.util.getRunningQueriesThunk())
        )

        // Translations
        const translations = await serverSideTranslations(locale, [
          'common',
          'projects',
          'diagram',
        ])

        const initialNodes: Node[] = []

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

        return {
          props: {
            projectId,
            initialNodes,
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
)
