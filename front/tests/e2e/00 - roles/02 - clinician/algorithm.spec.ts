/**
 * The internal imports
 */
import { test, expect } from '@/playwright/fixtures'

test.beforeEach(async ({ clinicianPage }) => {
  await clinicianPage.page.goto('/')
  await clinicianPage.page
    .getByRole('link', { name: 'Project for Tanzania' })
    .click()
  await clinicianPage.page.getByTestId('sidebar-algorithms').click()
  await expect(
    await clinicianPage.page.getByRole('heading', {
      name: 'Algorithms',
    })
  ).toBeVisible()
})

// TODO : Add the duplicate test once it's implemented
test.describe('Check clinician algorithm permissions', () => {
  test('should be able to create an algorithm', async ({ clinicianPage }) => {
    await expect(
      await clinicianPage.getByTestId('create-algorithm')
    ).toBeVisible()
    await clinicianPage.getByTestId('create-algorithm').click()
    await clinicianPage.fillInput('name', 'Test algorithm')
    await clinicianPage.fillInput('ageLimit', '4')
    await clinicianPage.fillTextarea(
      'ageLimitMessage',
      'This is a test age limit message'
    )
    await clinicianPage.fillInput('minimumAge', '2')
    await clinicianPage.selectOptionByValue('mode', 'arm_control')
    await clinicianPage.fillTextarea(
      'description',
      'This is a test description'
    )

    await clinicianPage.page
      .locator('label')
      .filter({ hasText: 'French' })
      .locator('span')
      .first()
      .click()

    await clinicianPage.submitForm()
    await expect(
      await clinicianPage.page.getByText('Saved successfully')
    ).toBeVisible()
  })

  test('should be able to update an algorithm', async ({ clinicianPage }) => {
    await clinicianPage.getByTestId('datatable-menu').first().click()
    await clinicianPage.page.getByRole('menuitem', { name: 'Edit' }).click()
    await clinicianPage.fillInput('minimumAge', '6')
    await clinicianPage.fillInput('ageLimit', '10')

    await clinicianPage.fillTextarea(
      'description',
      'This is another test description'
    )
    await clinicianPage.submitForm()

    await expect(
      await clinicianPage.page.getByText('Saved successfully')
    ).toBeVisible()
  })

  test('should be able to edit an algorithm through Algorithm Settings', async ({
    clinicianPage,
  }) => {
    await expect(
      await clinicianPage.getByTestId('datatable-menu').first()
    ).not.toBeVisible()
    await clinicianPage.page.getByTestId('datatable-show').first().click()
    await expect(
      await clinicianPage.page.getByRole('heading', {
        name: 'Decision trees & Diagnoses',
      })
    ).toBeVisible()
    await expect(
      clinicianPage.page.getByRole('button', {
        name: 'Algorithm settings',
      })
    ).toBeVisible()
    await clinicianPage.page
      .getByRole('button', {
        name: 'Algorithm settings',
      })
      .click()
    await clinicianPage.fillTextarea(
      'description',
      'This is yet another test description'
    )
    await clinicianPage.submitForm()

    await expect(
      await clinicianPage.page.getByText('Saved successfully')
    ).toBeVisible()
  })

  test('should be able to archive an algorithm', async ({ clinicianPage }) => {
    await expect(
      await clinicianPage.getByTestId('create-algorithm')
    ).toBeVisible()
    await clinicianPage.getByTestId('create-algorithm').click()
    await clinicianPage.fillInput('name', 'test archive')
    await clinicianPage.fillTextarea('ageLimitMessage', 'a message')
    await clinicianPage.fillInput('ageLimit', '3')
    await clinicianPage.fillInput('minimumAge', '2')
    await clinicianPage.selectOptionByValue('mode', 'arm_control')
    await clinicianPage.fillTextarea(
      'description',
      'This is a test description'
    )
    await clinicianPage.submitForm()

    await clinicianPage.page.waitForTimeout(500)

    await clinicianPage.fillInput('search', 'test archive')

    await clinicianPage.getByTestId('datatable-menu').first().click()
    await clinicianPage.page.getByRole('menuitem', { name: 'Archive' }).click()
    await clinicianPage.page.getByRole('button', { name: 'Yes' }).click()
    await expect(
      await clinicianPage.page.getByText('Archived successfully')
    ).toBeVisible()
  })

  test('should be able to duplicate an algorithm', ({ clinicianPage }) => {
    // TODO
  })

  test('should be able to search', async ({ clinicianPage }) => {
    await clinicianPage.searchFor('first algo', 'First algo')
    await clinicianPage.searchFor('toto', 'No data available')
  })
})
