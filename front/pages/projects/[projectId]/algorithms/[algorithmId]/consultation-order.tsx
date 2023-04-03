/**
 * The external imports
 */
import { ReactElement, useState } from 'react'
import { serverSideTranslations } from 'next-i18next/serverSideTranslations'
import { Heading, HStack, Spinner, Text } from '@chakra-ui/react'
import { useTranslation } from 'next-i18next'
import type { GetServerSidePropsContext } from 'next'
import {
  Tree,
  NodeModel,
  MultiBackend,
  getBackendOptions,
  DndProvider,
  DropOptions,
  getDescendants,
} from '@minoru/react-dnd-treeview'

/**
 * The internal imports
 */
import Layout from '@/lib/layouts/default'
import { Page, TreeNode } from '@/components'
import { wrapper } from '@/lib/store'
import {
  getAlgorithm,
  useGetAlgorithmQuery,
  getProject,
} from '@/lib/services/modules'
import { apiGraphql } from '@/lib/services/apiGraphql'
import { useTreeOpenHandler } from '@/lib/hooks'
import type { ConsultationOrderPage } from '@/types'

import styles from '@/styles/consultationOrder.module.scss'

const sampleData = [
  {
    id: 1,
    parent: 0,
    droppable: true,
    text: 'Registration',
  },
  {
    id: 2,
    parent: 1,
    text: 'Older children',
    data: {
      fileType: 'csv',
      fileSize: '0.5MB',
    },
  },
  {
    id: 3,
    parent: 1,
    text: 'Neonat children',
    data: {
      fileType: 'text',
      fileSize: '4.8MB',
    },
  },
  {
    id: 4,
    parent: 0,
    droppable: true,
    text: 'First Look Assessment',
  },
  {
    id: 5,
    parent: 4,
    droppable: true,
    text: 'Folder 2-1',
  },
  {
    id: 6,
    parent: 5,
    text: 'File 2-1-1',
    data: {
      fileType: 'image',
      fileSize: '2.1MB',
    },
  },
  {
    id: 7,
    parent: 0,
    droppable: true,
    text: 'ComplaintCategories',
  },
]

const reorderArray = (
  array: NodeModel[],
  sourceIndex: number,
  targetIndex: number
) => {
  const newArray = [...array]
  const element = newArray.splice(sourceIndex, 1)[0]
  newArray.splice(targetIndex, 0, element)
  return newArray
}

export default function ConsultationOrder({
  algorithmId,
}: ConsultationOrderPage) {
  const { t } = useTranslation('consultationOrder')

  const { ref, getPipeHeight, toggle } = useTreeOpenHandler()
  const [treeData, setTreeData] = useState<NodeModel[]>(sampleData)

  const handleDrop = (newTree: NodeModel[], e: DropOptions) => {
    const { dragSourceId, dropTargetId, destinationIndex } = e
    if (
      typeof dragSourceId === 'undefined' ||
      typeof dropTargetId === 'undefined'
    )
      return
    const start = treeData.find(v => v.id === dragSourceId)
    const end = treeData.find(v => v.id === dropTargetId)

    if (
      start?.parent === dropTargetId &&
      start &&
      typeof destinationIndex === 'number'
    ) {
      setTreeData(treeData => {
        const output = reorderArray(
          treeData,
          treeData.indexOf(start),
          destinationIndex
        )
        return output
      })
    }

    if (
      start?.parent !== dropTargetId &&
      start &&
      typeof destinationIndex === 'number'
    ) {
      if (
        getDescendants(treeData, dragSourceId).find(
          el => el.id === dropTargetId
        ) ||
        dropTargetId === dragSourceId ||
        (end && !end?.droppable)
      )
        return
      setTreeData(treeData => {
        const output = reorderArray(
          treeData,
          treeData.indexOf(start),
          destinationIndex
        )
        const movedElement = output.find(el => el.id === dragSourceId)
        if (movedElement) movedElement.parent = dropTargetId
        return output
      })
    }
  }

  const { data: algorithm, isSuccess: isAlgorithmSuccess } =
    useGetAlgorithmQuery(Number(algorithmId))

  if (isAlgorithmSuccess) {
    return (
      <Page title={algorithm.name}>
        <HStack justifyContent='space-between' mb={12}>
          <Heading as='h1'>{t('title')}</Heading>
        </HStack>

        <DndProvider backend={MultiBackend} options={getBackendOptions()}>
          <div className={styles.wrapper}>
            <Tree
              ref={ref}
              classes={{
                root: styles.treeRoot,
                placeholder: styles.placeholder,
                dropTarget: styles.dropTarget,
                listItem: styles.listItem,
              }}
              tree={treeData}
              sort={false}
              rootId={0}
              insertDroppableFirst={false}
              enableAnimateExpand={true}
              onDrop={handleDrop}
              canDrop={() => true}
              dropTargetOffset={5}
              placeholderRender={(_node, { depth }) => (
                <div
                  style={{
                    position: 'absolute',
                    top: 0,
                    right: 0,
                    height: 4,
                    left: depth * 24,
                    transform: 'translateY(-50%)',
                    backgroundColor: '#81a9e0',
                    zIndex: 100,
                  }}
                />
              )}
              render={(node, { depth, isOpen, isDropTarget }) => (
                <TreeNode
                  getPipeHeight={getPipeHeight}
                  node={node}
                  depth={depth}
                  isOpen={isOpen}
                  onClick={() => {
                    if (node.droppable) {
                      toggle(node?.id)
                    }
                  }}
                  isDropTarget={isDropTarget}
                  treeData={treeData}
                />
              )}
            />
          </div>
        </DndProvider>
      </Page>
    )
  }

  return <Spinner size='xl' />
}

ConsultationOrder.getLayout = function getLayout(page: ReactElement) {
  return <Layout menuType='algorithm'>{page}</Layout>
}

export const getServerSideProps = wrapper.getServerSideProps(
  store =>
    async ({ locale, query }: GetServerSidePropsContext) => {
      const { projectId, algorithmId } = query

      if (typeof locale === 'string') {
        store.dispatch(getProject.initiate(Number(projectId)))
        store.dispatch(getAlgorithm.initiate(Number(algorithmId)))
        await Promise.all(
          store.dispatch(apiGraphql.util.getRunningQueriesThunk())
        )

        // Translations
        const translations = await serverSideTranslations(locale, [
          'common',
          'datatable',
          'submenu',
          'algorithms',
          'consultationOrder',
        ])

        return {
          props: {
            algorithmId,
            projectId,
            locale,
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
