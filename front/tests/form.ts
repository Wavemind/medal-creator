/**
 * The external imports
 */
import { Page } from '@playwright/test'

export class Form {
  page: Page

  constructor(page: Page) {
    this.page = page
  }
}
