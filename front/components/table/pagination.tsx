/**
 * The external imports
 */
import { useTranslation } from 'next-i18next'
import { HStack, Button, Text, Select } from '@chakra-ui/react'

/**
 * The internal imports
 */
import type { PaginationComponent } from '@/types'
import { ChangeEvent } from 'react'

const Pagination: PaginationComponent = ({ setTableState, tableState }) => {
  const { t } = useTranslation('datatable')

  const {
    pageIndex,
    pageCount,
    hasNextPage,
    hasPreviousPage,
    totalCount,
    perPage,
  } = tableState

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
  const goTo = (edge: string) => {
    setTableState(prevState => ({
      ...prevState,
      pageIndex: edge === 'start' ? 1 : prevState.pageCount,
      endCursor: '',
      startCursor: '',
    }))
  }

  const updatePerPage = (event: ChangeEvent<HTMLSelectElement>) => {
    setTableState(prevState => ({
      ...prevState,
      pageIndex: 1,
      endCursor: '',
      startCursor: '',
      perPage: Number(event.target.value),
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
      <HStack spacing={10}>
        <HStack>
          <Text fontSize={14}>Rows per page :</Text>
          <Select value={perPage} onChange={updatePerPage}>
            <option value={5}>5</option>
            <option value={10}>10</option>
            <option value={15}>15</option>
            <option value={20}>20</option>
            <option value={30}>30</option>
          </Select>
        </HStack>
        <Text fontSize={14}>{t('totalCount', { totalCount })}</Text>
      </HStack>
    </HStack>
  )
}

export default Pagination
