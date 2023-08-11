import { test, expect } from '@playwright/test'

test('should navigate to the login page', async ({ page }) => {
  // Start from the index page (the baseURL is set via the webServer in the playwright.config.ts)
  await page.goto('http://localhost:3001/')
  // Find an element with the text 'About Page' and click on it
  await expect(page).toHaveTitle('medAL-creator | Sign in')
  // The new URL should be "/about" (baseURL is used there)
  // await expect(page).toHaveURL('http://localhost:3000/about')
  // The new page should contain an h1 with "About Page"
  // await expect(page.locator('h1')).toContainText('About Page')
})

function getByDataCy(selector: string) {
  return `[data-cy=${selector}]`;
}

function getByForm(inputType:string, selector:string) {
  return `[type="${inputType}"][name=${selector}]`;
}


test.describe('Authentication', () => {
  test('should be redirected to auth page', async ({ page }) => {
    await page.goto('/');
    expect(await page.url()).toContain('/auth/sign-in');
  });

  test('should contain email, password, submit button and forgot password link', async ({ page }) => {
    await page.goto('/auth/sign-in');

    expect(await page.isVisible(getByForm('email', 'email'))).toBe(true);
    expect(await page.isVisible(getByForm('password', 'password'))).toBe(true);
    expect(await page.isVisible(getByDataCy('submit'))).toBe(true);
    expect(await page.isVisible(getByDataCy('forgot_password'))).toBe(true);
  });

  test('should display an error message if form is empty', async ({ page }) => {
    await page.click(getByDataCy('submit'));
    
    const emailInput = await page.$(getByForm('email', 'email'));
    const emailValidation = await emailInput.checkValidity();
    expect(emailValidation.valid).toBe(false);
    expect(emailValidation.validationMessage).toContain('Please fill');

    const passwordInput = await page.$(getByForm('password', 'password'));
    const passwordValidation = await passwordInput.checkValidity();
    expect(passwordValidation.valid).toBe(false);
    expect(passwordValidation.validationMessage).toContain('Please fill');
  });

  test('should display an error message if user cannot connect', async ({ page }) => {
    await page.fill(getByForm('email', 'email'), 'test@test.com');
    await page.fill(getByForm('password', 'password'), process.env.ADMIN_PASSWORD);

    await page.click(getByDataCy('submit'));
    expect(await page.isVisible(getByDataCy('server_message'))).toBe(true);
  });

  test('should redirect user after successful login', async ({ page }) => {
    await page.fill(getByForm('email', 'email'), 'dev@wavemind.ch');
    await page.fill(getByForm('password', 'password'), process.env.ADMIN_PASSWORD);

    await page.click(getByDataCy('submit'));
    expect(await page.url()).toContain('/account/credentials');
  });
});
