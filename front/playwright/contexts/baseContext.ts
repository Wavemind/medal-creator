/**
 * The external imports
 */
import { type Page } from '@playwright/test'

export class BaseContext {
  page: Page
  projectName: string

  constructor(page: Page, projectName: string) {
    this.page = page
    this.projectName = projectName
  }
}
