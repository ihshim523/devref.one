# Instructions

- Following Playwright test failed.
- Explain why, be concise, respect Playwright best practices.
- Provide a snippet of code with the fix, if possible.

# Test info

- Name: headings.spec.ts >> Heading rendering — cheatsheet pages >> JavaScript page renders <h1> and <h2> headings
- Location: e2e/headings.spec.ts:6:7

# Error details

```
Test timeout of 30000ms exceeded.
```

```
Error: page.waitForSelector: Test timeout of 30000ms exceeded.
Call log:
  - waiting for locator('.cheatsheet-content') to be visible

```

# Test source

```ts
  1   | import { test, expect } from '@playwright/test';
  2   | 
  3   | // ── Happy path: basic heading rendering on standard cheatsheet pages ──
  4   | 
  5   | test.describe('Heading rendering — cheatsheet pages', () => {
  6   |   test('JavaScript page renders <h1> and <h2> headings', async ({ page }) => {
  7   |     await page.goto('/cheatsheets/javascript');
> 8   |     await page.waitForSelector('.cheatsheet-content');
      |                ^ Error: page.waitForSelector: Test timeout of 30000ms exceeded.
  9   | 
  10  |     const h1 = page.locator('h1');
  11  |     const h2 = page.locator('h2');
  12  | 
  13  |     // The top-level heading "JavaScript" is in a multi-line block
  14  |     // (# JavaScript\nModern JavaScript (ES2024+) quick reference.)
  15  |     await expect(h1).toHaveCount(1);
  16  |     await expect(h1).toHaveText('JavaScript');
  17  | 
  18  |     // Sub-headings are single-line blocks separated by blank lines
  19  |     await expect(h2.first()).toBeVisible();
  20  |     const h2Texts = await h2.allTextContents();
  21  |     expect(h2Texts).toContain('Variables');
  22  |     expect(h2Texts).toContain('Functions');
  23  |     expect(h2Texts).toContain('Promises & Async/Await');
  24  |     expect(h2Texts).toContain('Destructuring & Spread');
  25  |     expect(h2Texts).toContain('Array Methods');
  26  |     expect(h2Texts).toContain('Modules');
  27  |   });
  28  | 
  29  |   test('TypeScript page renders headings correctly', async ({ page }) => {
  30  |     await page.goto('/cheatsheets/typescript');
  31  |     await page.waitForSelector('.cheatsheet-content');
  32  | 
  33  |     const h1 = page.locator('h1');
  34  |     await expect(h1).toHaveText('TypeScript');
  35  | 
  36  |     const expected = ['Primitive Types', 'Interfaces & Types', 'Generics', 'Utility Types', 'Enums'];
  37  |     const h2Texts = await page.locator('h2').allTextContents();
  38  |     for (const item of expected) {
  39  |       expect(h2Texts).toContain(item);
  40  |     }
  41  |   });
  42  | 
  43  |   test('Python page renders headings correctly', async ({ page }) => {
  44  |     await page.goto('/cheatsheets/python');
  45  |     await page.waitForSelector('.cheatsheet-content');
  46  | 
  47  |     await expect(page.locator('h1')).toHaveText('Python');
  48  |     const h2s = await page.locator('h2').allTextContents();
  49  |     expect(h2s.length).toBeGreaterThan(0);
  50  |   });
  51  | 
  52  |   test('All headings on JavaScript page have proper hierarchy', async ({ page }) => {
  53  |     await page.goto('/cheatsheets/javascript');
  54  |     await page.waitForSelector('.cheatsheet-content');
  55  | 
  56  |     // There should be exactly one H1, and at least 6 H2s
  57  |     const h1Count = await page.locator('h1').count();
  58  |     const h2Count = await page.locator('h2').count();
  59  | 
  60  |     expect(h1Count).toBe(1);
  61  |     expect(h2Count).toBeGreaterThanOrEqual(6);
  62  | 
  63  |     // No H3+ should appear (this cheatsheet doesn't use them)
  64  |     const h3Count = await page.locator('h3').count();
  65  |     expect(h3Count).toBe(0);
  66  |   });
  67  | });
  68  | 
  69  | // ── Multi-line block heading scenarios ──
  70  | 
  71  | test.describe('Multi-line heading blocks', () => {
  72  |   test('Heading is followed by paragraph content in same block', async ({ page }) => {
  73  |     // The JavaScript page has: "# JavaScript\nModern JavaScript (ES2024+) quick reference."
  74  |     // This is a multi-line block — heading on line 1, paragraph on line 2.
  75  |     await page.goto('/cheatsheets/javascript');
  76  |     await page.waitForSelector('.cheatsheet-content');
  77  | 
  78  |     // The <h1> should be followed by a <p> containing the description
  79  |     const h1 = page.locator('h1');
  80  |     await expect(h1).toHaveText('JavaScript');
  81  | 
  82  |     // The description should render as a paragraph adjacent to the h1
  83  |     const content = page.locator('.cheatsheet-content');
  84  |     // The <p> after the h1 should contain the description text
  85  |     const firstP = content.locator('p').first();
  86  |     await expect(firstP).toContainText('Modern JavaScript');
  87  |   });
  88  | 
  89  |   test('Multi-line block with heading and additional lines renders all content', async ({ page }) => {
  90  |     // Check multiple heading levels in real content
  91  |     await page.goto('/cheatsheets/markdown');
  92  |     await page.waitForSelector('.cheatsheet-content');
  93  | 
  94  |     // The markdown cheatsheet should contain various heading levels
  95  |     const headings = page.locator('h1, h2, h3, h4, h5, h6');
  96  |     const count = await headings.count();
  97  |     expect(count).toBeGreaterThan(0);
  98  | 
  99  |     // Verify heading text is not empty
  100 |     for (let i = 0; i < count; i++) {
  101 |       const text = await headings.nth(i).textContent();
  102 |       expect(text?.trim().length).toBeGreaterThan(0);
  103 |     }
  104 |   });
  105 | });
  106 | 
  107 | // ── Single-line heading edge cases ──
  108 | 
```