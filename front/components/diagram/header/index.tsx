/**
 * The external imports
 */
import React from 'react'
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
import Validate from '@/components/diagram/header/validate'
import AddNodeMenu from '@/components/diagram/header/addMenuButton'
import { useGetDecisionTreeQuery } from '@/lib/api/modules/enhanced/decisionTree.enhanced'
import { useGetProjectQuery } from '@/lib/api/modules/enhanced/project.enhanced'
import { extractTranslation } from '@/lib/utils/string'
import { useAppRouter } from '@/lib/hooks'
import CloseIcon from '@/assets/icons/Close'
import DiagramService from '@/lib/services/diagram.service'
import { DiagramEnum } from '@/types'
import type { DiagramTypeComponent } from '@/types'

const DiagramHeader: DiagramTypeComponent = ({ diagramType }) => {
  const { t } = useTranslation('diagram')

  const {
    query: { instanceableId, projectId },
  } = useAppRouter()

  const { data: project, isLoading: isLoadingProject } = useGetProjectQuery({
    id: projectId,
  })

  const { data: decisionTree, isLoading: isLoadingDecisionTree } =
    useGetDecisionTreeQuery(
      diagramType === DiagramEnum.DecisionTree
        ? { id: instanceableId }
        : skipToken
    )

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
            {decisionTree &&
              decisionTree.cutOffStart &&
              decisionTree.cutOffEnd && (
                <Heading variant='h4' fontSize='sm'>
                  {DiagramService.readableDate(
                    decisionTree.cutOffStart || 0,
                    t
                  )}{' '}
                  -{' '}
                  {DiagramService.readableDate(
                    decisionTree.cutOffEnd || 5479,
                    t
                  )}
                </Heading>
              )}
          </Skeleton>
        </HStack>
      </VStack>
      <HStack spacing={4}>
        <AddNodeMenu diagramType={diagramType} />
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
