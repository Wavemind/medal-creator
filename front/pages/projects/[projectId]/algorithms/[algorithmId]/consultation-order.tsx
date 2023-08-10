/**
 * The external imports
 */
import React, { ReactElement, useState, useEffect } from 'react'
import { serverSideTranslations } from 'next-i18next/serverSideTranslations'
import { Box, Button, Center, Heading, HStack, Spinner } from '@chakra-ui/react'
import { useTranslation } from 'next-i18next'
import {
  Tree,
  MultiBackend,
  getBackendOptions,
  DndProvider,
  getDescendants,
} from '@minoru/react-dnd-treeview'
import type { GetServerSidePropsContext } from 'next/types'

/**
 * The internal imports
 */
import Layout from '@/lib/layouts/default'
import Page from '@/components/page'
import TreeNode from '@/components/tree/node'
import Preview from '@/components/tree/preview'
import { wrapper } from '@/lib/store'
import {
  useGetAlgorithmOrderingQuery,
  getProject,
  useUpdateAlgorithmMutation,
  getAlgorithmOrdering,
} from '@/lib/api/modules'
import { apiGraphql } from '@/lib/api/apiGraphql'
import { useTreeOpenHandler, useToast } from '@/lib/hooks'
import TreeOrderingService from '@/lib/services/treeOrdering.service'
import type {
  ConsultationOrderPage,
  TreeNodeModel,
  TreeNodeOptions,
} from '@/types'

import styles from '@/styles/consultationOrder.module.scss'

const ConsultationOrder = ({
  algorithmId,
  isAdminOrClinician,
}: ConsultationOrderPage) => {
  const { t } = useTranslation('consultationOrder')
  const { ref, getPipeHeight, toggle } = useTreeOpenHandler()
  const { newToast } = useToast()
  const [treeData, setTreeData] = useState<TreeNodeModel[]>([])
  const [enableDnd] = useState(isAdminOrClinician)

  const { data: algorithm, isSuccess: isAlgorithmSuccess } =
    useGetAlgorithmOrderingQuery({ id: algorithmId })

  const [
    updateAlgorithm,
    {
      isSuccess: isUpdateAlgorithmSuccess,
      isLoading: isUpdateAlgorithmLoading,
    },
  ] = useUpdateAlgorithmMutation()

  useEffect(() => {
    if (isUpdateAlgorithmSuccess) {
      newToast({
        message: t('notifications.updateSuccess', { ns: 'common' }),
        status: 'success',
      })
    }
  }, [isUpdateAlgorithmSuccess])

  useEffect(() => {
    if (isAlgorithmSuccess) {
      setTreeData(algorithm.formattedConsultationOrder)
    }
  }, [isAlgorithmSuccess])

  /**
   * Handles when an element is dropped after drag, updating the tree nodes
   */
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

  /**
   * Checks whether elements are droppable
   */
  const handleCanDrop = (
    _tree: TreeNodeModel[],
    { dragSource, dropTarget }: TreeNodeOptions
  ): boolean => {
    if (enableDnd && dragSource && dropTarget) {
      return TreeOrderingService.canDrop(dragSource, dropTarget)
    }
    return false
  }

  /**
   * Checks whether elements are draggable
   */
  const handleCanDrag = (node: TreeNodeModel | undefined): boolean => {
    if (enableDnd && node) {
      return TreeOrderingService.canDrag(node)
    }
    return false
  }

  /**
   * Saves the updated consultation order to the database
   */
  const handleSave = (): void => {
    updateAlgorithm({
      id: algorithmId,
      name: algorithm!.name,
      fullOrderJson: JSON.stringify(treeData),
    })
  }

  if (isAlgorithmSuccess) {
    return (
      <Page title={algorithm.name}>
        <HStack justifyContent='space-between' mb={12}>
          <Heading as='h1'>{t('title')}</Heading>
        </HStack>

        <DndProvider backend={MultiBackend} options={getBackendOptions()}>
          <Tree
            ref={ref}
            classes={{
              root: styles.treeRoot,
            }}
            tree={treeData}
            sort={false}
            rootId={0}
            insertDroppableFirst={true}
            enableAnimateExpand={true}
            onDrop={handleDrop}
            canDrag={handleCanDrag}
            canDrop={handleCanDrop}
            dropTargetOffset={5}
            placeholderRender={(_node, { depth }) => (
              <Box position='relative'>
                <Box
                  position='absolute'
                  bottom={0}
                  right={0}
                  height={1}
                  left={`${depth * TreeOrderingService.TREE_X_OFFSET_PX}px`}
                  transform='translateY(-100%)'
                  backgroundColor='treePlaceholder'
                  zIndex={100}
                />
              </Box>
            )}
            render={(node, { depth, isOpen, hasChild }) => (
              <TreeNode
                enableDnd={enableDnd}
                getPipeHeight={getPipeHeight}
                node={node}
                usedVariables={algorithm.usedVariables}
                depth={depth}
                isOpen={isOpen}
                hasChild={hasChild}
                onClick={() => {
                  if (node.droppable) {
                    toggle(node?.id)
                  }
                }}
                treeData={treeData}
              />
            )}
            dragPreviewRender={({ item }) => <Preview node={item} />}
          />
        </DndProvider>

        {isAdminOrClinician && (
          <Button
            position='fixed'
            bottom={12}
            right={12}
            onClick={handleSave}
            isLoading={isUpdateAlgorithmLoading}
          >
            {t('save', { ns: 'common' })}
          </Button>
        )}
      </Page>
    )
  }

  return (
    <React.Fragment>
      <HStack justifyContent='space-between' mb={12}>
        <Heading as='h1'>{t('title')}</Heading>
      </HStack>
      <Center h={500}>
        <Spinner size='xl' />
      </Center>
    </React.Fragment>
  )
}

export default ConsultationOrder

ConsultationOrder.getLayout = function getLayout(page: ReactElement) {
  return <Layout menuType='algorithm'>{page}</Layout>
}

export const getServerSideProps = wrapper.getServerSideProps(
  store =>
    async ({ locale, query }: GetServerSidePropsContext) => {
      const { projectId, algorithmId } = query

      if (
        typeof locale === 'string' &&
        typeof projectId === 'string' &&
        typeof algorithmId === 'string'
      ) {
        store.dispatch(getProject.initiate({ id: projectId }))
        store.dispatch(getAlgorithmOrdering.initiate({ id: algorithmId }))
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
          'variables',
        ])

        return {
          props: {
            algorithmId,
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
