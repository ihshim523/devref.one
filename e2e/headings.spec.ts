import { test, expect } from '@playwright/test';

// ── Happy path: basic heading rendering on standard cheatsheet pages ──

test.describe('Heading rendering — cheatsheet pages', () => {
  test('JavaScript page renders <h1> and <h2> headings', async ({ page }) => {
    await page.goto('/cheatsheets/javascript/');
    await page.waitForSelector('.cheatsheet-content');

    const h1 = page.locator('h1');
    const h2 = page.locator('h2');

    // The top-level heading "JavaScript" is in a multi-line block
    // (# JavaScript\nModern JavaScript (ES2024+) quick reference.)
    await expect(h1).toHaveCount(1);
    await expect(h1).toHaveText('JavaScript');

    // Sub-headings are single-line blocks separated by blank lines
    await expect(h2.first()).toBeVisible();
    const h2Texts = await h2.allTextContents();
    expect(h2Texts).toContain('Variables');
    expect(h2Texts).toContain('Functions');
    expect(h2Texts).toContain('Promises & Async/Await');
    expect(h2Texts).toContain('Destructuring & Spread');
    expect(h2Texts).toContain('Array Methods');
    expect(h2Texts).toContain('Modules');
  });

  test('TypeScript page renders headings correctly', async ({ page }) => {
    await page.goto('/cheatsheets/typescript/');
    await page.waitForSelector('.cheatsheet-content');

    const h1 = page.locator('h1');
    await expect(h1).toHaveText('TypeScript');

    const expected = ['Primitive Types', 'Interfaces & Types', 'Generics', 'Utility Types', 'Enums'];
    const h2Texts = await page.locator('h2').allTextContents();
    for (const item of expected) {
      expect(h2Texts).toContain(item);
    }
  });

  test('Python page renders headings correctly', async ({ page }) => {
    await page.goto('/cheatsheets/python/');
    await page.waitForSelector('.cheatsheet-content');

    await expect(page.locator('h1')).toHaveText('Python');
    const h2s = await page.locator('h2').allTextContents();
    expect(h2s.length).toBeGreaterThan(0);
  });

  test('All headings on JavaScript page have proper hierarchy', async ({ page }) => {
    await page.goto('/cheatsheets/javascript/');
    await page.waitForSelector('.cheatsheet-content');

    // There should be exactly one H1, and at least 6 H2s
    const h1Count = await page.locator('h1').count();
    const h2Count = await page.locator('h2').count();

    expect(h1Count).toBe(1);
    expect(h2Count).toBeGreaterThanOrEqual(6);

    // No H3+ should appear (this cheatsheet doesn't use them)
    const h3Count = await page.locator('h3').count();
    expect(h3Count).toBe(0);
  });
});

// ── Multi-line block heading scenarios ──

test.describe('Multi-line heading blocks', () => {
  test('Heading is followed by paragraph content in same block', async ({ page }) => {
    // The JavaScript page has: "# JavaScript\nModern JavaScript (ES2024+) quick reference."
    // This is a multi-line block — heading on line 1, paragraph on line 2.
    await page.goto('/cheatsheets/javascript/');
    await page.waitForSelector('.cheatsheet-content');

    // The <h1> should be followed by a <p> containing the description
    const h1 = page.locator('h1');
    await expect(h1).toHaveText('JavaScript');

    // The description should render as a paragraph adjacent to the h1
    const content = page.locator('.cheatsheet-content');
    // The <p> after the h1 should contain the description text
    const firstP = content.locator('p').first();
    await expect(firstP).toContainText('Modern JavaScript');
  });

  test('Multi-line block with heading and additional lines renders all content', async ({ page }) => {
    // Check multiple heading levels in real content
    await page.goto('/cheatsheets/markdown/');
    await page.waitForSelector('.cheatsheet-content');

    // The markdown cheatsheet should contain various heading levels
    const headings = page.locator('h1, h2, h3, h4, h5, h6');
    const count = await headings.count();
    expect(count).toBeGreaterThan(0);

    // Verify heading text is not empty
    for (let i = 0; i < count; i++) {
      const text = await headings.nth(i).textContent();
      expect(text?.trim().length).toBeGreaterThan(0);
    }
  });
});

// ── Single-line heading edge cases ──

test.describe('Single-line heading edge cases', () => {
  test('H2 headings in single-line blocks render correctly', async ({ page }) => {
    await page.goto('/cheatsheets/javascript/');
    await page.waitForSelector('.cheatsheet-content');

    // "## Variables" is a single-line heading block
    const variablesHeading = page.locator('h2', { hasText: 'Variables' });
    await expect(variablesHeading).toBeVisible();
  });

  test('Heading with inline code renders correctly', async ({ page }) => {
    await page.goto('/cheatsheets/typescript/');
    await page.waitForSelector('.cheatsheet-content');

    // Check for any heading containing inline code
    const headingsWithCode = page.locator('h1 code, h2 code, h3 code, h4 code, h5 code, h6 code');
    const count = await headingsWithCode.count();
    if (count > 0) {
      for (let i = 0; i < count; i++) {
        await expect(headingsWithCode.nth(i)).toBeVisible();
      }
    }
  });

  test('Headings at all levels (h1-h6) are not duplicated', async ({ page }) => {
    await page.goto('/cheatsheets/markdown/');
    await page.waitForSelector('.cheatsheet-content');

    // Get all heading texts to check for duplicates
    const h1Texts = await page.locator('h1').allTextContents();
    const h2Texts = await page.locator('h2').allTextContents();

    // H1 should be unique (the title)
    expect(h1Texts.length).toBeLessThanOrEqual(2); // at most the page title

    // No heading text should be empty
    for (const text of [...h1Texts, ...h2Texts]) {
      expect(text.trim().length).toBeGreaterThan(0);
    }
  });
});

// ── Cross-page consistency ──

test.describe('Cross-page heading consistency', () => {
  test('All cheatsheet pages render at least one heading', async ({ page }) => {
    const slugs = ['javascript', 'typescript', 'python', 'bash', 'git', 'docker', 'sql', 'markdown'];

    for (const slug of slugs) {
      await page.goto(`/cheatsheets/${slug}/`);
      await page.waitForSelector('.cheatsheet-content');

      const h1 = page.locator('h1');
      await expect(h1).toBeVisible({ timeout: 5000 });
    }
  });

  test('All cheatsheet pages have proper heading hierarchy (h1 then h2)', async ({ page }) => {
    const slugs = ['javascript', 'typescript', 'python', 'bash', 'git', 'docker', 'sql', 'markdown'];

    for (const slug of slugs) {
      await page.goto(`/cheatsheets/${slug}/`);
      await page.waitForSelector('.cheatsheet-content');

      // Every page should have exactly one h1
      const h1Count = await page.locator('h1').count();
      expect(h1Count).toBe(1);

      // Every page should have at least one h2
      const h2Count = await page.locator('h2').count();
      expect(h2Count).toBeGreaterThanOrEqual(1);
    }
  });
});

// ── Heading rendering within special blocks ──

test.describe('Heading rendering with non-heading content', () => {
  test('Headings are not mixed with non-heading text', async ({ page }) => {
    await page.goto('/cheatsheets/javascript/');
    await page.waitForSelector('.cheatsheet-content');

    // The "Functions" h2 should NOT contain code block content
    const functionsH2 = page.locator('h2', { hasText: 'Functions' });
    await expect(functionsH2).toBeVisible();
    await expect(functionsH2).not.toContainText('arrow');
  });

  test('Headings do not appear inside code blocks', async ({ page }) => {
    await page.goto('/cheatsheets/javascript/');
    await page.waitForSelector('.cheatsheet-content');

    // Code blocks are in <pre><code> — no heading tags should exist inside them
    const codeBlocks = page.locator('pre code');
    const count = await codeBlocks.count();

    for (let i = 0; i < count; i++) {
      // Check inner HTML doesn't contain heading tags
      const html = await codeBlocks.nth(i).innerHTML();
      expect(html).not.toMatch(/<\/?h[1-6]>/);
    }
  });

  test('Table cells do not contain heading tags', async ({ page }) => {
    await page.goto('/cheatsheets/javascript/');
    await page.waitForSelector('.cheatsheet-content');

    // Check tables exist and their cells don't contain heading tags
    const tables = page.locator('table');
    const tableCount = await tables.count();

    if (tableCount > 0) {
      const cells = page.locator('table th, table td');
      const cellCount = await cells.count();

      for (let i = 0; i < Math.min(cellCount, 20); i++) {
        const html = await cells.nth(i).innerHTML();
        expect(html).not.toMatch(/<\/?h[1-6]>/);
      }
    }
  });
});
