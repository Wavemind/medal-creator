/**
 * The internal imports
 */
import type { PaginationResult, TableState } from '@/types'

class Datatable {
  private static instance: Datatable
  readonly DEFAULT_TABLE_PER_PAGE = 30

  public static getInstance(): Datatable {
    if (!Datatable.instance) {
      Datatable.instance = new Datatable()
    }

    return Datatable.instance
  }

  public calculatePagination(props: TableState): PaginationResult {
    const {
      endCursor,
      startCursor,
      pageCount,
      pageIndex,
      lastPerPage,
      perPage,
    } = props

    const pagination: PaginationResult = {
      first: null,
      last: null,
    }

    // If both are empty
    if (endCursor === '' && startCursor === '') {
      // Querying first page
      if (pageCount === 1) {
        pagination.first = perPage
      } else if (pageIndex === pageCount) {
        // Querying last page
        // If the last page has fewer than the normal perPage,
        // get only that many, otherwise get the full perPage
        pagination.last = lastPerPage !== 0 ? lastPerPage : perPage
      } else {
        pagination.first = perPage
      }
      // If endCursor is not empty => forward pagination
    } else if (endCursor !== '') {
      pagination.first = perPage
      // If startCursor is not empty => backward pagination
    } else {
      pagination.last = perPage
    }

    return pagination
  }
}

export default Datatable.getInstance()
