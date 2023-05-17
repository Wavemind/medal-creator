export function convertToNumber(text: string | string[] | undefined): number {
  return Number(text)
}

export const integerRegex = /^-?\d+$/
export const floatRegex = /^-?\d+\.\d+$/
