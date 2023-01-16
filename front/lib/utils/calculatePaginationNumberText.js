export default props => {
  const { endCursor, startCursor, pageCount, pageIndex, lastPerPage, perPage } =
    props

  // If both are empty
  if (endCursor === '' && startCursor === '') {
    // Querying first page
    if (pageCount === 1) {
      return `first: ${perPage}`
    } else if (pageIndex === pageCount) {
      // Querying last page
      // If the last page has fewer than the normal perPage,
      // get only that many, otherwise get the full perPage
      return `last: ${lastPerPage !== 0 ? lastPerPage : perPage}`
    } else {
      return `first: ${perPage}`
    }
    // If endCursor is not empty => forward pagination
  } else if (endCursor !== '') {
    return `first: ${perPage}`
    // If startCursor is not empty => backward pagination
  } else {
    return `last: ${perPage}`
  }
}
