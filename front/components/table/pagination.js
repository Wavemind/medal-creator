/**
 * The external imports
 */
import { useTranslation } from 'next-i18next'
import { HStack, Button, Text, Select } from '@chakra-ui/react'

const Pagination = ({ setPaginationState, paginationState }) => {
  const { t } = useTranslation('datatable')

  const { perPage, pageIndex, pageCount, hasNextPage, hasPreviousPage } =
    paginationState

  const goForward = () => {
    setPaginationState(prevState => ({
      ...prevState,
      pageIndex: prevState.pageIndex + 1,
      startCursor: '',
    }))
  }

  const goBackward = () => {
    setPaginationState(prevState => ({
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
    setPaginationState(prevState => ({
      ...prevState,
      pageIndex: edge === 'start' ? 1 : prevState.pageCount,
      endCursor: '',
      startCursor: '',
    }))
  }

  const changePerPage = event => {
    setPaginationState(prevState => ({
      ...prevState,
      perPage: Number(event.target.value),
      endCursor: '',
      startCursor: '',
    }))
  }

  return (
    <HStack spacing={2} marginLeft={5}>
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
      <HStack>
        <Text>{t('show')}</Text>
        <Select flex={1} value={perPage} onChange={e => changePerPage(e)}>
          {[1, 2, 3, 4, 5, 10].map(pageSize => (
            <option key={pageSize} value={pageSize}>
              {pageSize}
            </option>
          ))}
        </Select>
      </HStack>
    </HStack>
  )
}

export default Pagination
