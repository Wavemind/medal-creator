/**
 * The internal imports
 */
import { test, expect } from '@/playwright/fixtures'

test.beforeEach(async ({ clinicianContext }) => {
  await clinicianContext.page.goto('/')
  await clinicianContext.page
    .getByRole('link', { name: 'Project for Tanzania' })
    .click()
  await clinicianContext.page.getByTestId('sidebar-library').click()
})

test.describe('Check clinician variable permissions', () => {
  test('should be able to create a variable', async ({ clinicianContext }) => {
    // TODO : Haha it's huge
  })

  test('should be able to update a variable', async ({ clinicianContext }) => {
    await clinicianContext.getByTestId('variable-edit-button').last().click()
    await expect(await clinicianContext.getSelect('type')).toHaveAttribute(
      'disabled',
      ''
    )
    await expect(
      await clinicianContext.getSelect('answerTypeId')
    ).toHaveAttribute('disabled', '')
    await clinicianContext.fillInput('label', 'updated label')
    await clinicianContext.nextStep()
    await clinicianContext.submitForm()

    await expect(
      await clinicianContext.page.getByRole('cell', { name: 'updated label' })
    ).toBeVisible()
  })

  test('should be able to duplicate a variable', async ({
    clinicianContext,
  }) => {
    await clinicianContext.getByTestId('datatable-menu').first().click()
    await clinicianContext.page
      .getByRole('menuitem', { name: 'Duplicate' })
      .click()
    await clinicianContext.page.getByRole('button', { name: 'Yes' }).click()
    await expect(
      await clinicianContext.page.getByText('Duplicated successfully')
    ).toBeVisible()
  })

  test('should be able to delete a variable', async ({ clinicianContext }) => {
    await clinicianContext.getByTestId('datatable-menu').first().click()
    await clinicianContext.page
      .getByRole('menuitem', { name: 'Delete' })
      .click()
    await clinicianContext.page.getByRole('button', { name: 'Yes' }).click()
    await expect(
      await clinicianContext.page.getByText('Deleted successfully')
    ).toBeVisible()
  })

  test('should be able to to see the variable details', async ({
    clinicianContext,
  }) => {
    await clinicianContext.getByTestId('datatable-menu').first().click()
    await clinicianContext.page.getByRole('menuitem', { name: 'Info' }).click()
    await expect(await clinicianContext.page.getByText('Fever')).toBeVisible()
    await clinicianContext.getByTestId('close-modal').click()
  })

  test('should not be able to create, edit, duplicate or delete a variable, but should view details', async ({
    clinicianContext,
  }) => {
    await expect(
      await clinicianContext.page.getByRole('heading', {
        name: 'Variables',
      })
    ).toBeVisible()
    await expect(
      await clinicianContext.getByTestId('create-variable')
    ).not.toBeVisible()
    await clinicianContext.getByTestId('datatable-menu').first().click()
    await expect(
      await clinicianContext.page.getByRole('menuitem', { name: 'Edit' })
    ).not.toBeVisible()
    await expect(
      await clinicianContext.page.getByRole('menuitem', {
        name: 'Duplicate',
      })
    ).not.toBeVisible()
    await expect(
      await clinicianContext.page.getByRole('menuitem', { name: 'Delete' })
    ).not.toBeVisible()
  })

  test('should be able to search', async ({ clinicianContext }) => {
    await clinicianContext.searchFor('Cough', 'Cough')
    await clinicianContext.searchFor('toto', 'No data available')
  })
})
