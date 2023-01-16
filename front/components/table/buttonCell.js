/**
 * The external imports
 */
import { Button } from '@chakra-ui/react'
import { useTranslation } from 'next-i18next'

const ButtonCell = ({ info, onButtonClick, labelKey }) => {
  const { t } = useTranslation('datatable')

  return (
    <Button width='auto' onClick={() => onButtonClick(info)}>
      {t(labelKey)}
    </Button>
  )
}

export default ButtonCell
