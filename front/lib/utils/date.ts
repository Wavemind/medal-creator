/**
 * The external imports
 */
import { format } from 'date-fns'

export const formatDate = (date: Date): string => format(date, 'dd.LL.yyyy')
