/**
 * The external imports
 */
import type { Page } from '@playwright/test'

export async function setInputValue(
  page: Page,
  inputName: string,
  value: string
): Promise<void> {
  const inputSelector = `input[name="${inputName}"]`

  await page.fill(inputSelector, value)
}
