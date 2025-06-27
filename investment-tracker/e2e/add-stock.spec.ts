import { test, expect } from '@playwright/test'

test.describe('Add Stock Functionality', () => {
  test.beforeEach(async ({ page }) => {
    await page.goto('/')
    
    // Open the add stock dialog
    await page.getByRole('button', { name: /add stock/i }).click()
    await expect(page.getByText('Add Stock to Watchlist')).toBeVisible()
  })

  test('should require ticker field', async ({ page }) => {
    await page.getByRole('button', { name: /add stock/i }).click()
    
    // Should show validation error
    await expect(page.getByText(/ticker is required/i)).toBeVisible()
  })

  test('should require company name field', async ({ page }) => {
    await page.getByLabel(/stock ticker/i).fill('AAPL')
    await page.getByRole('button', { name: /add stock/i }).click()
    
    // Should show validation error for company name
    await expect(page.getByText(/company name is required/i)).toBeVisible()
  })

  test('should add stock with watching status', async ({ page }) => {
    await page.getByLabel(/stock ticker/i).fill('AAPL')
    await page.getByLabel(/company name/i).fill('Apple Inc.')
    
    // Status should default to "Watching"
    await expect(page.getByRole('combobox')).toHaveText('Watching')
    
    await page.getByRole('button', { name: /add stock/i }).click()
    
    // Dialog should close and stock should be added
    await expect(page.getByText('Add Stock to Watchlist')).not.toBeVisible()
    
    // Should show success message or see the stock in the list
    await expect(page.getByText('AAPL')).toBeVisible()
  })

  test('should add stock with owned status and quantity', async ({ page }) => {
    await page.getByLabel(/stock ticker/i).fill('MSFT')
    await page.getByLabel(/company name/i).fill('Microsoft Corporation')
    
    // Change status to "Owned"
    await page.getByRole('combobox').click()
    await page.getByText('Owned').click()
    
    // Quantity and price fields should appear
    await expect(page.getByLabel(/quantity/i)).toBeVisible()
    await expect(page.getByLabel(/average price/i)).toBeVisible()
    
    await page.getByLabel(/quantity/i).fill('100')
    await page.getByLabel(/average price/i).fill('350.50')
    
    await page.getByRole('button', { name: /add stock/i }).click()
    
    // Dialog should close
    await expect(page.getByText('Add Stock to Watchlist')).not.toBeVisible()
    
    // Should see the stock with owned status
    await expect(page.getByText('MSFT')).toBeVisible()
  })

  test('should handle uppercase ticker conversion', async ({ page }) => {
    await page.getByLabel(/stock ticker/i).fill('aapl')
    await page.getByLabel(/company name/i).fill('Apple Inc.')
    
    await page.getByRole('button', { name: /add stock/i }).click()
    
    // Should convert to uppercase and add successfully
    await expect(page.getByText('AAPL')).toBeVisible()
  })

  test('should handle sold status', async ({ page }) => {
    await page.getByLabel(/stock ticker/i).fill('TSLA')
    await page.getByLabel(/company name/i).fill('Tesla Inc.')
    
    // Change status to "Sold"
    await page.getByRole('combobox').click()
    await page.getByText('Sold').click()
    
    await page.getByRole('button', { name: /add stock/i }).click()
    
    await expect(page.getByText('Add Stock to Watchlist')).not.toBeVisible()
    await expect(page.getByText('TSLA')).toBeVisible()
  })

  test('should add notes to stock', async ({ page }) => {
    await page.getByLabel(/stock ticker/i).fill('GOOGL')
    await page.getByLabel(/company name/i).fill('Alphabet Inc.')
    
    const notesField = page.getByLabel(/notes/i)
    if (await notesField.isVisible()) {
      await notesField.fill('Strong growth potential in AI')
    }
    
    await page.getByRole('button', { name: /add stock/i }).click()
    
    await expect(page.getByText('GOOGL')).toBeVisible()
  })

  test('should handle API errors gracefully', async ({ page }) => {
    // Mock network failure
    await page.route('**/trpc/**', route => route.abort())
    
    await page.getByLabel(/stock ticker/i).fill('INVALID')
    await page.getByLabel(/company name/i).fill('Invalid Company')
    
    await page.getByRole('button', { name: /add stock/i }).click()
    
    // Should show error message
    await expect(page.getByText(/error/i)).toBeVisible()
  })

  test('should validate numeric fields', async ({ page }) => {
    await page.getByLabel(/stock ticker/i).fill('NVDA')
    await page.getByLabel(/company name/i).fill('NVIDIA Corporation')
    
    // Change to owned status to show quantity/price fields
    await page.getByRole('combobox').click()
    await page.getByText('Owned').click()
    
    // Try invalid quantity
    await page.getByLabel(/quantity/i).fill('-10')
    await page.getByLabel(/average price/i).fill('abc')
    
    await page.getByRole('button', { name: /add stock/i }).click()
    
    // Should show validation errors
    await expect(page.getByText(/quantity must be positive/i)).toBeVisible()
    await expect(page.getByText(/price must be a valid number/i)).toBeVisible()
  })

  test('should clear form after successful submission', async ({ page }) => {
    await page.getByLabel(/stock ticker/i).fill('AMD')
    await page.getByLabel(/company name/i).fill('Advanced Micro Devices')
    
    await page.getByRole('button', { name: /add stock/i }).click()
    
    // Wait for dialog to close and reopen
    await expect(page.getByText('Add Stock to Watchlist')).not.toBeVisible()
    await page.getByRole('button', { name: /add stock/i }).click()
    
    // Form should be cleared
    await expect(page.getByLabel(/stock ticker/i)).toHaveValue('')
    await expect(page.getByLabel(/company name/i)).toHaveValue('')
  })
})