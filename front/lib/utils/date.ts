/**
 * The external imports
 */
import { format } from 'date-fns'

export const formatDate = (date: Date): string => format(date, 'dd.LL.yyyy')

/**
 * Change display of patient date follow those rules
 * Creation date of medical case - patient date of birth
 *
 * Rules
 * < 7 days | display age in days -> 6 days old
 * >= 7 days < 31 days | display age in weeks ex: lower rounding 3.5 weeks become 3 weeks -> 3 weeks old
 * >= 31 days < 730 | display age in months (1 month = 30.4375) ex: Lower rounding 3.5 months become 3 months -> 3 months old
 * >= 24 month | display age in years ex: Lower rounding 3.5 year -> 3 years old
 *
 * @returns [String] human readable date
 */
export const readableDate = (
  ageInDays: number
): { value: number; unit: string } => {
  if (ageInDays < 7) {
    return { value: ageInDays, unit: 'days' }
  }

  if (ageInDays >= 7 && ageInDays < 31) {
    return { value: Math.floor(ageInDays / 7), unit: 'weeks' }
  }

  if (ageInDays >= 31 && ageInDays < 730) {
    return { value: Math.floor(ageInDays / 30.4375), unit: 'months' }
  }

  return { value: Math.floor(ageInDays / 365.25), unit: 'years' }
}
