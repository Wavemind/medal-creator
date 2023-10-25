/**
 * The external imports
 */
import { format, formatDuration, intervalToDuration } from 'date-fns'

export const formatDate = (date: Date): string => format(date, 'dd.LL.yyyy')

export const customFormatDuration = (elapsedTime: number): string => {
  const durations = intervalToDuration({ start: 0, end: elapsedTime * 1000 })
  return formatDuration(durations)
}
