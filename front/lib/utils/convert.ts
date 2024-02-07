/**
 * The external imports
 */
import type { SingleValue } from 'chakra-react-select'

/*
 * The internal imports
 */
import type { Option } from '@/types'

export function convertToNumber(text: string | string[] | undefined): number {
  return Number(text)
}

export const convertSingleValueToBooleanOrNull = (
  data: SingleValue<Option>
): boolean | null => {
  if (data && data.value) {
    return data.value === 'true'
  }
  return null
}
