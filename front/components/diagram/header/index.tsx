/**
 * The external imports
 */
import React, { useEffect, useState } from 'react'
import {
  HStack,
  Skeleton,
  Heading,
  IconButton,
  VStack,
  Breadcrumb,
  BreadcrumbItem,
  BreadcrumbLink,
} from '@chakra-ui/react'
import { ChevronRightIcon } from '@chakra-ui/icons'
import { skipToken } from '@reduxjs/toolkit/dist/query'
import { useTranslation } from 'next-i18next'
import { Link } from '@chakra-ui/next-js'

/**
 * The internal imports
 */
import Validate from './validate'
import { useGetDecisionTreeQuery, useGetProjectQuery } from '@/lib/api/modules'
import { extractTranslation, readableDate } from '@/lib/utils'
import { useAppRouter } from '@/lib/hooks'
import { CloseIcon } from '@/assets/icons'
import AddNodeButton from './addNodeButton'
import { DiagramEnum, type DiagramTypeComponent } from '@/types'

const DiagramHeader: DiagramTypeComponent = ({ diagramType }) => {
  const { t } = useTranslation('diagram')

  const [cutOffStart, setCutOffStart] = useState({
    unit: '',
    value: 0,
  })
  const [cutOffEnd, setCutOffEnd] = useState({
    unit: '',
    value: 0,
  })

  const {
    query: { instanceableId, projectId },
  } = useAppRouter()

  const { data: project, isLoading: isLoadingProject } = useGetProjectQuery({
    id: projectId,
  })

  const {
    data: decisionTree,
    isSuccess: isGetDecisionTreeSuccess,
    isLoading: isLoadingDecisionTree,
  } = useGetDecisionTreeQuery(
    diagramType === DiagramEnum.DecisionTree
      ? { id: instanceableId }
      : skipToken
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

  return (
    <HStack w='full' p={4} justifyContent='space-evenly'>
      <VStack w='full' alignItems='flex-start'>
        <Breadcrumb
          fontSize='xs'
          separator={<ChevronRightIcon color='gray.500' />}
        >
          <BreadcrumbItem>
            <Skeleton isLoaded={!isLoadingProject}>
              <BreadcrumbLink href={`/projects/${project?.id}`}>
                {project?.name}
              </BreadcrumbLink>
            </Skeleton>
          </BreadcrumbItem>

          <BreadcrumbItem>
            <Skeleton isLoaded={!isLoadingDecisionTree}>
              <BreadcrumbLink
                href={`/projects/${project?.id}/algorithms/${decisionTree?.algorithm.id}`}
              >
                {decisionTree?.algorithm.name}
              </BreadcrumbLink>
            </Skeleton>
          </BreadcrumbItem>
        </Breadcrumb>
        <HStack w='full' spacing={8}>
          <Skeleton isLoaded={!isLoadingProject && !isLoadingDecisionTree}>
            <Heading variant='h2' fontSize='md'>
              {extractTranslation(
                decisionTree?.labelTranslations,
                project?.language.code
              )}
            </Heading>
          </Skeleton>
          <Skeleton isLoaded={!isLoadingProject && !isLoadingDecisionTree}>
            <Heading variant='h4' fontSize='sm'>
              {extractTranslation(
                decisionTree?.node.labelTranslations,
                project?.language.code
              )}
            </Heading>
          </Skeleton>
          <Skeleton isLoaded={!isLoadingDecisionTree}>
            {cutOffStart.unit && cutOffEnd.unit && (
              <Heading variant='h4' fontSize='sm'>
                {t(`date.${cutOffStart.unit}`, {
                  count: cutOffStart.value,
                  ns: 'common',
                  defaultValue: '',
                })}{' '}
                -{' '}
                {t(`date.${cutOffEnd.unit}`, {
                  count: cutOffEnd.value,
                  ns: 'common',
                  defaultValue: '',
                })}
              </Heading>
            )}
          </Skeleton>
        </HStack>
      </VStack>
      <HStack spacing={4}>
        <AddNodeButton diagramType={diagramType} />
        <Validate diagramType={diagramType} />
        <IconButton
          as={Link}
          variant='ghost'
          ml={4}
          href={`/projects/${project?.id}/algorithms/${decisionTree?.algorithm.id}`}
          icon={<CloseIcon />}
          aria-label='close'
        />
      </HStack>
    </HStack>
  )
}

export default DiagramHeader
