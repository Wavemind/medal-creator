/**
 * The external imports
 */
import format from 'date-fns/format'
import isValid from 'date-fns/isValid'

export const formatDate = date => {
  if (isValid(date)) {
    return format(date, 'dd.LL.yyyy')
  }
  return format(new Date(date), 'dd.LL.yyyy')
}
