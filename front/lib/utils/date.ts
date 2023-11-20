/**
 * The external imports
 */
import { format, formatDuration, intervalToDuration } from 'date-fns'

export const formatDate = (date: Date): string => format(date, 'dd.LL.yyyy')

export const customFormatDuration = (elapsedTime: number): string => {
  if (elapsedTime === 0) return ''
  const timming = elapsedTime > 1 ? elapsedTime : 1
  const durations = intervalToDuration({ start: 0, end: timming * 1000 })
  return formatDuration(durations)
}
