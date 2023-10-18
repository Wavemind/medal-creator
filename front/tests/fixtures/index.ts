/**
 * The external imports
 */
import { test as base } from '@playwright/test'

/**
 * The internal imports
 */
import {
  AdminContext,
  ClinicianContext,
  DeploymentManagerContext,
  EmptyContext,
  ProjectAdminContext,
  ViewerContext,
} from '@/tests/contexts'
import type { Contexts } from '@/types'

export const test = base.extend<Contexts>({
  adminContext: async ({ browser }, use) => {
    const context = await browser.newContext({
      storageState: '../.auth/admin.json',
    })
    const adminContext = new AdminContext(
      await context.newPage(),
      'Super admin project'
    )
    await use(adminContext)
    await context.close()
  },
  projectAdminContext: async ({ browser }, use) => {
    const context = await browser.newContext({
      storageState: '../.auth/projectAdmin.json',
    })
    const projectAdminContext = new ProjectAdminContext(
      await context.newPage(),
      'Project admin project'
    )
    await use(projectAdminContext)
    await context.close()
  },
  clinicianContext: async ({ browser }, use) => {
    const context = await browser.newContext({
      storageState: '../.auth/clinician.json',
    })
    const clinicianContext = new ClinicianContext(
      await context.newPage(),
      'Clinician project'
    )
    await use(clinicianContext)
    await context.close()
  },
  deploymentManagerContext: async ({ browser }, use) => {
    const context = await browser.newContext({
      storageState: '../.auth/deploymentManager.json',
    })
    const viewerContext = new DeploymentManagerContext(
      await context.newPage(),
      'Deployment manager project'
    )
    await use(viewerContext)
    await context.close()
  },
  viewerContext: async ({ browser }, use) => {
    const context = await browser.newContext({
      storageState: '../.auth/viewer.json',
    })
    const viewerContext = new ViewerContext(
      await context.newPage(),
      'Viewer project'
    )
    await use(viewerContext)
    await context.close()
  },
  emptyContext: async ({ browser }, use) => {
    const context = await browser.newContext()
    const viewerContext = new EmptyContext(await context.newPage())
    await use(viewerContext)
    await context.close()
  },
})
