/**
 * The external imports
 */
import { type Page } from '@playwright/test'

// TODO : Clean the methods when finished
// TODO : Extract form interaction in another class
export class BaseContext {
  page: Page
  projectName: string

  constructor(page: Page, projectName: string) {
    this.page = page
    this.projectName = projectName
  }
}
