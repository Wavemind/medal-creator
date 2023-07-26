/**
 * The external imports
 */
import React, { useCallback, useContext, useEffect, useState } from 'react'
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
import { skipToken } from '@reduxjs/toolkit/dist/query'
import { useTranslation } from 'next-i18next'

/**
 * The internal imports
 */
import { DiagnosisForm, VariableStepper } from '@/components'
import Validate from './validate'
import { useGetDecisionTreeQuery, useGetProjectQuery } from '@/lib/api/modules'
import { extractTranslation, readableDate } from '@/lib/utils'
import { useAppRouter } from '@/lib/hooks'
import { ModalContext } from '@/lib/contexts'
import { DiagramEnum, type DiagramTypeComponent } from '@/types'
import { FormEnvironments } from '@/lib/config/constants'

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

  const { open: openModal } = useContext(ModalContext)

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

  const addVariable = useCallback(() => {
    openModal({
      content: (
        <VariableStepper
          projectId={projectId}
          formEnvironment={FormEnvironments.DecisionTreeDiagram} // TODO: HAVE TO BE CHECK
        />
      ),
      size: '5xl',
    })
  }, [])

  const addMedicalCondition = useCallback(() => {
    console.log('adding a medicalCondition')
  }, [])

  const addDiagnosis = useCallback(() => {
    openModal({
      title: t('new', { ns: 'diagnoses' }),
      content: (
        <DiagnosisForm decisionTreeId={instanceableId} projectId={projectId} />
      ),
    })
  }, [])

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
        <Menu>
          <MenuButton
            as={Button}
            variant='outline'
            leftIcon={<BsPlus />}
            rightIcon={<ChevronDownIcon />}
          >
            {t('add', { ns: 'common' })}
          </MenuButton>
          <MenuList>
            <MenuItem onClick={addVariable}>{t('add.variable')}</MenuItem>
            <MenuItem onClick={addMedicalCondition}>
              {t('add.medicalCondition')}
            </MenuItem>
            <MenuItem onClick={addDiagnosis}>{t('add.diagnosis')}</MenuItem>
          </MenuList>
        </Menu>
        <Validate diagramType={diagramType} />
        <Button as={Button} onClick={() => console.log('coucou')}>
          {t('save', { ns: 'common' })}
        </Button>
      </HStack>
    </HStack>
  )
}

export default DiagramHeader
