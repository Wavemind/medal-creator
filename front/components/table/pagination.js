/**
 * The external imports
 */
import { useTranslation } from 'next-i18next'
import { HStack, Button, Text } from '@chakra-ui/react'

const Pagination = ({ setTableState, tableState }) => {
  const { t } = useTranslation('datatable')

  const { pageIndex, pageCount, hasNextPage, hasPreviousPage } = tableState

  /**
   * Sets the pagination state for forward navigation
   */
  const goForward = () => {
    setTableState(prevState => ({
      ...prevState,
      pageIndex: prevState.pageIndex + 1,
      startCursor: '',
    }))
  }

  /**
   * Sets the pagination state for backward navigation
   */
  const goBackward = () => {
    setTableState(prevState => ({
      ...prevState,
      pageIndex: prevState.pageIndex - 1,
      endCursor: '',
    }))
  }

  /**
   * Goes to the start or the end of the pagination
   * @param {*} edge String
   */
  const goTo = edge => {
    setTableState(prevState => ({
      ...prevState,
      pageIndex: edge === 'start' ? 1 : prevState.pageCount,
      endCursor: '',
      startCursor: '',
    }))
  }

  return (
    <HStack spacing={2} marginLeft={5} py={2}>
      <Button
        onClick={() => goTo('start')}
        disabled={!hasPreviousPage}
        variant='ghost'
      >
        {'<<'}
      </Button>
      <Button onClick={goBackward} disabled={!hasPreviousPage} variant='ghost'>
        {t('prev')}
      </Button>
      <Text>{t('page', { pageIndex, pageCount })}</Text>
      <Button onClick={goForward} disabled={!hasNextPage} variant='ghost'>
        {t('next')}
      </Button>
      <Button
        onClick={() => goTo('end')}
        disabled={!hasNextPage}
        variant='ghost'
      >
        {'>>'}
      </Button>
    </HStack>
  )
}

export default Pagination
