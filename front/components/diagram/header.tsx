/**
 * The external imports
 */
import {
  HStack,
  Skeleton,
  Heading,
  Menu,
  MenuButton,
  Button,
  MenuList,
  MenuItem,
} from '@chakra-ui/react'
import { BsPlus } from 'react-icons/bs'
import { ChevronDownIcon } from '@chakra-ui/icons'
import { useEffect, useState } from 'react'
import { skipToken } from '@reduxjs/toolkit/dist/query'
import { useTranslation } from 'next-i18next'

/**
 * The internal imports
 */
import { useGetDecisionTreeQuery, useGetProjectQuery } from '@/lib/api/modules'
import { extractTranslation, readableDate } from '@/lib/utils'
import { useAppRouter } from '@/lib/hooks'
import { DiagramEnum, type DiagramTypeComponent } from '@/types'

const DiagramHeader: DiagramTypeComponent = ({ diagramType }) => {
  const { t } = useTranslation('diagram')

  const {
    query: { instanceableId, projectId },
  } = useAppRouter()

  const [cutOffStart, setCutOffStart] = useState({
    unit: '',
    value: 0,
  })
  const [cutOffEnd, setCutOffEnd] = useState({
    unit: '',
    value: 0,
  })

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
  )
}

export default DiagramHeader
