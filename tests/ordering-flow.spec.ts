import { test, expect } from '@playwright/test';

test.describe('Ordering Flow', () => {
  test('should allow a user to add a product to cart and proceed to checkout', async ({ page }) => {
    page.on('console', msg => console.log('BROWSER LOG:', msg.text()));
    // 1. Navigate to Landing Page
    await page.goto('/');
    
    // 2. Find a product (e.g., iPhone 16 Pro Max) and click it
    const productCard = page.locator('text=iPhone 16 Pro Max').first();
    await expect(productCard).toBeVisible({ timeout: 15000 });
    await productCard.click();

    // 3. Add to Cart on Product Details Page
    const addToCartButton = page.locator('button:has-text("Add to Cart")').first();
    await expect(addToCartButton).toBeVisible();
    await addToCartButton.click();

    // 4. Navigate to Checkout (Cart page equivalent)
    await page.goto('/checkout');

    // 5. Verify Redirect to Login (since checkout is a protected route and user is not authenticated)
    await expect(page).toHaveURL(/.*\/login/);
    
    console.log('✅ Ordering flow verified up to login redirect.');
  });
});
