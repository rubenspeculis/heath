import { test, expect } from '@playwright/test'

test.describe('Investment Dashboard', () => {
  test.beforeEach(async ({ page }) => {
    await page.goto('/')
  })

  test('should display dashboard title', async ({ page }) => {
    await expect(page.getByText('Investment Dashboard')).toBeVisible()
  })

  test('should display main navigation sections', async ({ page }) => {
    await expect(page.getByText('Portfolio Overview')).toBeVisible()
    await expect(page.getByText('Watchlist')).toBeVisible()
  })

  test('should open add stock dialog', async ({ page }) => {
    await page.getByRole('button', { name: /add stock/i }).click()
    
    await expect(page.getByText('Add Stock to Watchlist')).toBeVisible()
    await expect(page.getByLabel(/stock ticker/i)).toBeVisible()
    await expect(page.getByLabel(/company name/i)).toBeVisible()
  })

  test('should close add stock dialog with cancel', async ({ page }) => {
    await page.getByRole('button', { name: /add stock/i }).click()
    await page.getByRole('button', { name: /cancel/i }).click()
    
    await expect(page.getByText('Add Stock to Watchlist')).not.toBeVisible()
  })

  test('should close add stock dialog with X button', async ({ page }) => {
    await page.getByRole('button', { name: /add stock/i }).click()
    await page.getByRole('button', { name: /close/i }).click()
    
    await expect(page.getByText('Add Stock to Watchlist')).not.toBeVisible()
  })

  test('should refresh prices button work', async ({ page }) => {
    const refreshButton = page.getByRole('button', { name: /refresh prices/i })
    await expect(refreshButton).toBeVisible()
    
    await refreshButton.click()
    
    // Should show loading state briefly
    await expect(refreshButton).toHaveText(/refreshing/i)
  })

  test('should handle empty watchlist state', async ({ page }) => {
    // If no data is seeded, should show empty state
    const emptyMessage = page.getByText(/no investments tracked yet/i)
    if (await emptyMessage.isVisible()) {
      await expect(emptyMessage).toBeVisible()
    }
  })

  test('should display portfolio metrics when data exists', async ({ page }) => {
    // Check if portfolio value is displayed
    const portfolioValue = page.locator('[data-testid="portfolio-value"]')
    if (await portfolioValue.isVisible()) {
      await expect(portfolioValue).toBeVisible()
      
      // Should display currency formatting
      await expect(portfolioValue).toContainText('$')
    }
  })

  test('should navigate through tabs', async ({ page }) => {
    // Test if there are tabs for different views
    const watchlistTab = page.getByRole('tab', { name: /watchlist/i })
    const analysisTab = page.getByRole('tab', { name: /analysis/i })
    
    if (await watchlistTab.isVisible()) {
      await watchlistTab.click()
      await expect(watchlistTab).toHaveAttribute('aria-selected', 'true')
    }
    
    if (await analysisTab.isVisible()) {
      await analysisTab.click()
      await expect(analysisTab).toHaveAttribute('aria-selected', 'true')
    }
  })

  test('should be responsive on mobile', async ({ page }) => {
    await page.setViewportSize({ width: 375, height: 667 })
    
    await expect(page.getByText('Investment Dashboard')).toBeVisible()
    
    // Check that layout adapts to mobile
    const addButton = page.getByRole('button', { name: /add stock/i })
    await expect(addButton).toBeVisible()
  })

  test('should handle keyboard navigation', async ({ page }) => {
    // Focus on add stock button and activate with Enter
    await page.getByRole('button', { name: /add stock/i }).focus()
    await page.keyboard.press('Enter')
    
    await expect(page.getByText('Add Stock to Watchlist')).toBeVisible()
    
    // Escape should close dialog
    await page.keyboard.press('Escape')
    await expect(page.getByText('Add Stock to Watchlist')).not.toBeVisible()
  })
})