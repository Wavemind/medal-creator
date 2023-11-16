/**
 * The external imports
 */
import React, { useCallback } from 'react'
import { Menu, MenuButton, Button, MenuList, MenuItem } from '@chakra-ui/react'
import { BsPlus } from 'react-icons/bs'
import { ChevronDownIcon } from '@chakra-ui/icons'
import { useTranslation } from 'next-i18next'

/**
 * The internal imports
 */
import DiagnosisForm from '@/components/forms/diagnosis'
import VariableStepper from '@/components/forms/variableStepper'
import { useAppRouter, useModal } from '@/lib/hooks'
import { FormEnvironments } from '@/lib/config/constants'
import QuestionSequencesForm from '@/components/forms/questionsSequence'
import ManagementForm from '@/components/forms/management'
import DrugStepper from '@/components/forms/drugStepper'
import useDiagramActions from '@/lib/hooks/useDiagramActions'
import { DiagramEnum } from '@/types'
import type { DiagramTypeComponent } from '@/types'

const AddNodeMenu: DiagramTypeComponent = ({ diagramType }) => {
  const { t } = useTranslation('diagram')

  const { addVariableToDiagram, addDiagnosisToDiagram } = useDiagramActions({
    diagramType,
  })

  const { open: openModal } = useModal()

  const {
    query: { instanceableId },
  } = useAppRouter()

  const openVariableForm = useCallback(() => {
    openModal({
      content: (
        <VariableStepper
          formEnvironment={FormEnvironments.DecisionTreeDiagram}
          callback={addVariableToDiagram}
        />
      ),
      size: '5xl',
    })
  }, [t])

  const openDiagnosisForm = useCallback(() => {
    openModal({
      title: t('new', { ns: 'diagnoses' }),
      content: (
        <DiagnosisForm
          decisionTreeId={instanceableId}
          callback={addDiagnosisToDiagram}
        />
      ),
    })
  }, [t])

  const openMedicalConditionForm = useCallback(() => {
    openModal({
      title: t('new', { ns: 'questionsSequence' }),
      content: <QuestionSequencesForm callback={addVariableToDiagram} />,
    })
  }, [t])

  const openManagementForm = useCallback(() => {
    openModal({
      title: t('new', { ns: 'managements' }),
      content: <ManagementForm callback={addVariableToDiagram} />,
    })
  }, [t])

  const openDrugForm = useCallback(() => {
    openModal({
      title: t('new', { ns: 'drugs' }),
      content: <DrugStepper callback={addVariableToDiagram} />,
      size: '5xl',
    })
  }, [t])

  return (
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
        <MenuItem onClick={openVariableForm}>{t('add.variable')}</MenuItem>
        <MenuItem onClick={openMedicalConditionForm}>
          {t('add.medicalCondition')}
        </MenuItem>
        {diagramType === DiagramEnum.DecisionTree && (
          <MenuItem onClick={openDiagnosisForm}>{t('add.diagnosis')}</MenuItem>
        )}

        {diagramType === DiagramEnum.Diagnosis && (
          <React.Fragment>
            <MenuItem onClick={openManagementForm}>
              {t('add.management')}
            </MenuItem>
            <MenuItem onClick={openDrugForm}>{t('add.drug')}</MenuItem>
          </React.Fragment>
        )}
      </MenuList>
    </Menu>
  )
}

export default AddNodeMenu
