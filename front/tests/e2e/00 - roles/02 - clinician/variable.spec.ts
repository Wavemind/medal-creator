/**
 * The internal imports
 */
import { test, expect } from '@/playwright/fixtures'

test.beforeEach(async ({ clinicianPage }) => {
  await clinicianPage.page.goto('/')
  await clinicianPage.page
    .getByRole('link', { name: 'Project for Tanzania' })
    .click()
  await clinicianPage.page.getByTestId('sidebar-library').click()
})

test.describe('Check clinician variable permissions', () => {
  test('should be able to create a variable', async ({ clinicianPage }) => {
    // TODO : Haha it's huge
  })

  test('should be able to update a variable', async ({ clinicianPage }) => {
    await clinicianPage.getByTestId('variable-edit-button').last().click()
    await expect(await clinicianPage.getSelect('type')).toHaveAttribute(
      'disabled',
      ''
    )
    await expect(await clinicianPage.getSelect('answerTypeId')).toHaveAttribute(
      'disabled',
      ''
    )
    await clinicianPage.fillInput('label', 'updated label')
    await clinicianPage.nextStep()
    await clinicianPage.submitForm()

    await expect(
      await clinicianPage.page.getByRole('cell', { name: 'updated label' })
    ).toBeVisible()
  })

  test('should be able to duplicate a variable', async ({ clinicianPage }) => {
    await clinicianPage.getByTestId('datatable-menu').first().click()
    await clinicianPage.page
      .getByRole('menuitem', { name: 'Duplicate' })
      .click()
    await clinicianPage.page.getByRole('button', { name: 'Yes' }).click()
    await expect(
      await clinicianPage.page.getByText('Duplicated successfully')
    ).toBeVisible()
  })

  test('should be able to delete a variable', async ({ clinicianPage }) => {
    await clinicianPage.getByTestId('datatable-menu').first().click()
    await clinicianPage.page.getByRole('menuitem', { name: 'Delete' }).click()
    await clinicianPage.page.getByRole('button', { name: 'Yes' }).click()
    await expect(
      await clinicianPage.page.getByText('Deleted successfully')
    ).toBeVisible()
  })

  test('should be able to to see the variable details', async ({
    clinicianPage,
  }) => {
    await clinicianPage.getByTestId('datatable-menu').first().click()
    await clinicianPage.page.getByRole('menuitem', { name: 'Info' }).click()
    await expect(await clinicianPage.page.getByText('Fever')).toBeVisible()
    await clinicianPage.getByTestId('close-modal').click()
  })

  test('should not be able to create, edit, duplicate or delete a variable, but should view details', async ({
    clinicianPage,
  }) => {
    await expect(
      await clinicianPage.page.getByRole('heading', {
        name: 'Variables',
      })
    ).toBeVisible()
    await expect(
      await clinicianPage.getByTestId('create-variable')
    ).not.toBeVisible()
    await clinicianPage.getByTestId('datatable-menu').first().click()
    await expect(
      await clinicianPage.page.getByRole('menuitem', { name: 'Edit' })
    ).not.toBeVisible()
    await expect(
      await clinicianPage.page.getByRole('menuitem', {
        name: 'Duplicate',
      })
    ).not.toBeVisible()
    await expect(
      await clinicianPage.page.getByRole('menuitem', { name: 'Delete' })
    ).not.toBeVisible()
  })

  test('should be able to search', async ({ clinicianPage }) => {
    await clinicianPage.searchFor('Cough', 'Cough')
    await clinicianPage.searchFor('toto', 'No data available')
  })
})
