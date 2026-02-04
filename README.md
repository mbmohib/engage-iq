# EngageIQ - Smart LinkedIn Comment Generator

Chrome extension that analyzes LinkedIn posts and generates intelligent, personalized comments with multiple tone variations.

## Tech Stack

- **TypeScript** - Type-safe development
- **React 18** - UI components
- **Tailwind CSS** - Styling
- **Vite** - Build tool
- **Chrome Extension API** - Manifest V3

## Setup

1. Install dependencies:

```bash
npm install
```

2. Build the extension:

```bash
npm run build
```

3. Load in Chrome:

- Open `chrome://extensions/`
- Enable "Developer mode"
- Click "Load unpacked"
- Select the `dist` folder

## Development

Run in watch mode:

```bash
npm run dev
```

## Testing

### Unit Tests (Vitest)

```bash
npm test              # Run unit tests
npm run test:ui       # Run tests with UI
```

### E2E Tests (Playwright)

```bash
npm run test:e2e      # Run E2E tests
npm run test:e2e:ui   # Run E2E tests with UI
```

### Test Structure

```
tests/
├── unit/             # Unit tests for utilities and components
├── e2e/              # End-to-end tests for extension flows
├── fixtures/         # Test data and mock posts
└── setup.ts          # Test environment setup
```

## Project Structure

```
src/
├── types/            # TypeScript type definitions
├── background/       # Service worker & LLM integration (.ts)
├── content/          # LinkedIn page injection (.ts)
│   ├── scraper.ts   # LinkedIn DOM scraping
│   └── dom-injector.ts  # Button injection
├── sidepanel/        # React-based UI (.tsx)
├── popup/            # Settings interface (.tsx)
└── utils/            # Shared utilities (.ts)
```

## TypeScript

The project uses TypeScript for type safety. All source files are `.ts` or `.tsx`. Type definitions are centralized in `src/types/index.ts`.

## CI/CD

GitHub Actions workflow runs on every push:

- Unit tests with Vitest
- E2E tests with Playwright
- Build verification
