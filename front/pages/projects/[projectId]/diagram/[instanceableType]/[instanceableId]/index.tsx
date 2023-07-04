/**
 * The external imports
 */
import {
  Flex,
  HStack,
  Heading,
  Menu,
  MenuButton,
  Button,
  MenuItem,
  MenuList,
  Skeleton,
  VStack,
} from '@chakra-ui/react'
import { serverSideTranslations } from 'next-i18next/serverSideTranslations'
import { ReactFlowProvider } from 'reactflow'
import { useTranslation } from 'next-i18next'
import { skipToken } from '@reduxjs/toolkit/dist/query'

import { useEffect, type ReactElement, useState } from 'react'
import { ChevronDownIcon } from '@chakra-ui/icons'
import { BsPlus } from 'react-icons/bs'
import 'reactflow/dist/base.css'
import type { GetServerSidePropsContext } from 'next'
import type { Node, Edge } from 'reactflow'

/**
 * The internal imports
 */
import { apiGraphql } from '@/lib/api/apiGraphql'
import {
  getComponents,
  getDecisionTree,
  getProject,
  useGetDecisionTreeQuery,
  useGetProjectQuery,
} from '@/lib/api/modules'
import DiagramLayout from '@/lib/layouts/diagram'
import { wrapper } from '@/lib/store'
import { DiagramWrapper, Page, DiagramSideBar } from '@/components'
import { DiagramService } from '@/lib/services'
import { DiagramTypeEnum } from '@/lib/config/constants'
import { readableDate } from '@/lib/utils'
import type { AvailableNode, DiagramPage } from '@/types'

export default function Diagram({
  initialNodes,
  initialEdges,
  diagramType,
  instanceableId,
  projectId,
}: DiagramPage) {
  const { t } = useTranslation('diagram')

  const [cutOffStart, setCutOffStart] = useState({})
  const [cutOffEnd, setCutOffEnd] = useState({})

  const {
    data: project,
    isSuccess: isGetProjectSuccess,
    isLoading: isLoadingProject,
  } = useGetProjectQuery(projectId)

  const {
    data: decisionTree,
    isSuccess: isGetDecisionTreeSuccess,
    isLoading: isLoadingDecisionTree,
  } = useGetDecisionTreeQuery(
    diagramType === DiagramTypeEnum.DecisionTree ? instanceableId : skipToken
  )

  useEffect(() => {
    if (
      isGetDecisionTreeSuccess &&
      decisionTree.cutOffStart &&
      decisionTree.cutOffEnd
    ) {
      setCutOffStart(readableDate(decisionTree.cutOffStart))
      setCutOffEnd(readableDate(decisionTree.cutOffEnd))
    }
  }, [isGetDecisionTreeSuccess])

  // FIX IT
  return (
    <Page title={t('title')}>
      <ReactFlowProvider>
        <Flex flex={1}>
          <DiagramSideBar diagramType={diagramType} />
          <VStack w='full'>
            <HStack w='full' p={4} justifyContent='space-evenly'>
              <HStack w='full' spacing={8}>
                <Skeleton
                  isLoaded={!isLoadingProject && !isLoadingDecisionTree}
                >
                  <Heading variant='h2' fontSize='md'>
                    {isGetProjectSuccess &&
                      isGetDecisionTreeSuccess &&
                      decisionTree.labelTranslations[project.language.code]}
                  </Heading>
                </Skeleton>
                <Skeleton
                  isLoaded={!isLoadingProject && !isLoadingDecisionTree}
                >
                  <Heading variant='h4' fontSize='sm'>
                    {isGetProjectSuccess &&
                      isGetDecisionTreeSuccess &&
                      decisionTree.node.labelTranslations[
                        project.language.code
                      ]}
                  </Heading>
                </Skeleton>
                <Skeleton isLoaded={!isLoadingDecisionTree}>
                  <Heading variant='h4' fontSize='sm'>
                    {t(`date.${cutOffStart.unit}`, {
                      count: cutOffStart.value,
                      ns: 'common',
                    })}{' '}
                    -{' '}
                    {t(`date.${cutOffEnd.unit}`, {
                      count: cutOffEnd.value,
                      ns: 'common',
                    })}
                  </Heading>
                </Skeleton>
              </HStack>
              <HStack spacing={4}>
                {/*TODO: waiting design*/}
                <Menu>
                  <MenuButton
                    as={Button}
                    variant='outline'
                    leftIcon={<BsPlus />}
                    rightIcon={<ChevronDownIcon />}
                  >
                    Add
                  </MenuButton>
                  <MenuList>
                    <MenuItem>Download</MenuItem>
                    <MenuItem>Create a Copy</MenuItem>
                    <MenuItem>Mark as Draft</MenuItem>
                    <MenuItem>Delete</MenuItem>
                    <MenuItem>Attend a Workshop</MenuItem>
                  </MenuList>
                </Menu>
                <Button>Validate</Button>
              </HStack>
            </HStack>
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

      if (typeof locale === 'string') {
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
