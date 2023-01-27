/**
 * The external imports
 */
import { useTranslation } from 'next-i18next'
import { HStack, Button, Text } from '@chakra-ui/react'

const Pagination = ({ setTableState, tableState }) => {
  const { t } = useTranslation('datatable')

  const { pageIndex, pageCount, hasNextPage, hasPreviousPage, totalCount } =
    tableState

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
    <HStack py={2} px={5} justifyContent='space-between'>
      <HStack spacing={2}>
        <Button
          onClick={() => goTo('start')}
          isDisabled={!hasPreviousPage}
          variant='ghost'
          fontSize={14}
        >
          {'<<'}
        </Button>
        <Button
          onClick={goBackward}
          isDisabled={!hasPreviousPage}
          variant='ghost'
          fontSize={14}
        >
          {t('prev')}
        </Button>
        <Text fontSize={14}>{t('page', { pageIndex, pageCount })}</Text>
        <Button
          onClick={goForward}
          isDisabled={!hasNextPage}
          variant='ghost'
          fontSize={14}
        >
          {t('next')}
        </Button>
        <Button
          onClick={() => goTo('end')}
          isDisabled={!hasNextPage}
          variant='ghost'
          fontSize={14}
        >
          {'>>'}
        </Button>
      </HStack>
      <Text fontSize={14}>{t('totalCount', { totalCount })}</Text>
    </HStack>
  )
}

export default Pagination
