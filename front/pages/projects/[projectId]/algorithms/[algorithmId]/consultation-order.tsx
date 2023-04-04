/**
 * The external imports
 */
import { ReactElement, useState } from 'react'
import { serverSideTranslations } from 'next-i18next/serverSideTranslations'
import { Heading, HStack, Spinner } from '@chakra-ui/react'
import { useTranslation } from 'next-i18next'
import {
  Tree,
  MultiBackend,
  getBackendOptions,
  DndProvider,
  getDescendants,
} from '@minoru/react-dnd-treeview'
import type { GetServerSidePropsContext } from 'next'

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
  useGetProjectQuery,
} from '@/lib/api/modules'
import { apiGraphql } from '@/lib/api/apiGraphql'
import { useTreeOpenHandler } from '@/lib/hooks'
import { TreeOrderingService } from '@/lib/services'
import type {
  ConsultationOrderPage,
  TreeNodeModel,
  TreeNodeOptions,
} from '@/types'

import styles from '@/styles/consultationOrder.module.scss'

const sampleData = [
  {
    id: 1,
    parent: 0,
    droppable: true,
    text: '',
    data: {
      labelTranslations: { fr: 'Registration FR', en: 'Registration EN' },
    },
  },
  {
    id: 4,
    parent: 0,
    droppable: true,
    text: '',
    data: {
      labelTranslations: {
        fr: 'First Look Assessment FR',
        en: 'First Look Assessment EN',
      },
    },
  },
  {
    id: 5,
    parent: 4,
    droppable: true,
    text: '',
    data: {
      labelTranslations: { fr: 'A question FR', en: 'A question EN' },
    },
  },
  {
    id: 6,
    parent: 5,
    text: '',
    data: {
      labelTranslations: { fr: 'Weight FR', en: 'Weight EN' },
    },
  },
  {
    id: 7,
    parent: 0,
    droppable: true,
    text: '',
    data: {
      labelTranslations: {
        fr: 'Complaint category FR',
        en: 'Complaint category EN',
      },
    },
  },
  {
    id: 2,
    parent: 7,
    droppable: true,
    text: '',
    data: {
      labelTranslations: { fr: 'Older children FR', en: 'Older children EN' },
    },
  },
  {
    id: 6,
    parent: 2,
    text: '',
    data: {
      labelTranslations: { fr: 'Weight FR', en: 'Weight EN' },
    },
  },
  {
    id: 10,
    parent: 2,
    text: '',
    data: {
      labelTranslations: { fr: 'Weight FR', en: 'Weight EN' },
    },
  },
  {
    id: 11,
    parent: 2,
    text: '',
    data: {
      labelTranslations: { fr: 'Weight FR', en: 'Weight EN' },
    },
  },
  {
    id: 12,
    parent: 2,
    text: '',
    data: {
      labelTranslations: { fr: 'Weight FR', en: 'Weight EN' },
    },
  },
  {
    id: 3,
    parent: 7,
    droppable: true,
    text: '',
    data: {
      labelTranslations: { fr: 'Neonat Children FR', en: 'Neonat children EN' },
    },
  },
  {
    id: 12,
    parent: 3,
    text: '',
    data: {
      labelTranslations: { fr: 'Weight FR', en: 'Weight EN' },
    },
  },
  {
    id: 12,
    parent: 3,
    text: '',
    data: {
      labelTranslations: { fr: 'Weight FR', en: 'Weight EN' },
    },
  },
]

export default function ConsultationOrder({
  algorithmId,
  projectId,
}: ConsultationOrderPage) {
  const { t } = useTranslation('consultationOrder')
  const { ref, getPipeHeight, toggle } = useTreeOpenHandler()
  const [treeData, setTreeData] = useState<TreeNodeModel[]>(sampleData)

  const { data: algorithm, isSuccess: isAlgorithmSuccess } =
    useGetAlgorithmQuery(Number(algorithmId))
  const { data: project, isSuccess: isProjectSuccess } = useGetProjectQuery(
    Number(projectId)
  )

  const handleDrop = (
    _newTree: TreeNodeModel[],
    options: TreeNodeOptions
  ): void => {
    const { dragSourceId, dropTargetId, destinationIndex } = options
    if (
      typeof dragSourceId === 'undefined' ||
      typeof dropTargetId === 'undefined'
    )
      return
    const start = treeData.find(v => v.id === dragSourceId)
    const end = treeData.find(v => v.id === dropTargetId)

    if (!start || typeof destinationIndex !== 'number') return

    if (start.parent === dropTargetId) {
      setTreeData(treeData =>
        TreeOrderingService.reorder(
          treeData,
          treeData.indexOf(start),
          destinationIndex
        )
      )
    } else {
      if (
        getDescendants(treeData, dragSourceId).find(
          el => el.id === dropTargetId
        ) ||
        dropTargetId === dragSourceId ||
        (end && !end?.droppable)
      )
        return
      setTreeData(treeData => {
        const output = TreeOrderingService.reorder(
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

  const handleCanDrop = (
    _tree: TreeNodeModel[],
    { dragSource, dropTarget }: TreeNodeOptions
  ): boolean => {
    if (dragSource && dropTarget) {
      return TreeOrderingService.canDrop(dragSource, dropTarget)
    }
    return false
  }

  const handleCanDrag = (
    _tree: TreeNodeModel[],
    { dragSource, dropTarget }: TreeNodeOptions
  ): boolean => {
    if (dragSource && dropTarget) {
      return TreeOrderingService.canDrag(dragSource, dropTarget)
    }
    return false
  }

  if (isAlgorithmSuccess && isProjectSuccess) {
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
              canDrag={handleCanDrag}
              canDrop={handleCanDrop}
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
                  language={project.language.code}
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
