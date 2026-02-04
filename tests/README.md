# EngageIQ Tests

## Overview

This directory contains all tests for the EngageIQ Chrome extension.

## Test Structure

### Unit Tests (`/tests/unit/`)

Unit tests for individual functions and components using Vitest.

**Coverage:**
- `scraper.test.ts` - LinkedIn post scraping logic
- `post-analyzer.test.ts` - Post type and author role detection
- More to be added as features are implemented

**Running:**
```bash
npm test                    # Run all unit tests
npm test scraper           # Run specific test file
npm run test:ui            # Run with Vitest UI
```

### E2E Tests (`/tests/e2e/`)

End-to-end tests simulating real user flows with Playwright.

**Coverage:**
- `scraper.spec.ts` - DOM scraping functionality
- `extension-integration.spec.ts` - Extension loading and basic integration
- More flows to be added

**Running:**
```bash
npm run test:e2e           # Run all E2E tests
npm run test:e2e:ui        # Run with Playwright UI
npx playwright test --debug  # Debug mode
```

### Fixtures (`/tests/fixtures/`)

Mock data for tests:
- `mock-posts.json` - Sample LinkedIn posts covering different types (thought leadership, announcements, opinions, questions, celebrations)

## Writing Tests

### Unit Test Example

```typescript
import { describe, it, expect } from 'vitest';
import { myFunction } from '../../src/utils/my-function';

describe('MyFunction', () => {
  it('should do something', () => {
    const result = myFunction('input');
    expect(result).toBe('expected output');
  });
});
```

### E2E Test Example

```typescript
import { test, expect } from '@playwright/test';

test('should scrape post content', async ({ page }) => {
  await page.goto('about:blank');
  await page.setContent('<div class="post">Content</div>');
  
  const content = await page.locator('.post').textContent();
  expect(content).toBe('Content');
});
```

## CI/CD

Tests run automatically on GitHub Actions:
- Every push to `main` or `develop`
- Every pull request

See `.github/workflows/test.yml` for configuration.

## Best Practices

1. **Test Naming**: Use descriptive test names that explain what is being tested
2. **Arrange-Act-Assert**: Structure tests clearly
3. **Mock External Dependencies**: Use Vitest mocks for Chrome APIs
4. **Keep Tests Fast**: Unit tests should run in milliseconds
5. **Use Fixtures**: Share test data via fixtures directory
6. **Test Edge Cases**: Include happy path, error cases, and boundary conditions

## Chrome API Mocking

Chrome APIs are mocked in `tests/setup.ts`:
```typescript
global.chrome = {
  storage: { sync: { get: vi.fn(), set: vi.fn() } },
  runtime: { sendMessage: vi.fn() }
} as any;
```

Add more mocks as needed for testing.
