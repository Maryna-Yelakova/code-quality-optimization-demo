# Frontend Tools and Libraries Suggestions

Useful tools to improve code quality, consistency, performance, and team productivity.

## 1) Prettier
- Purpose: automatic code formatting.
- Why useful: removes style debates, keeps codebase consistent.
- Start:
```bash
npm install -D prettier
```
- Typical scripts:
```json
{
  "scripts": {
    "format": "prettier . --write",
    "format:check": "prettier . --check"
  }
}
```

## 2) ESLint
- Purpose: static analysis for JavaScript/TypeScript.
- Why useful: catches bugs early, enforces code-quality rules.
- Start:
```bash
npm install -D eslint @eslint/js
```

## 3) Stylelint
- Purpose: linting for CSS/SCSS.
- Why useful: catches invalid styles, improves maintainability.
- Start:
```bash
npm install -D stylelint stylelint-config-standard
```

## 4) TypeScript
- Purpose: static typing for JavaScript.
- Why useful: safer refactors, better autocomplete, fewer runtime errors.
- Start:
```bash
npm install -D typescript
npx tsc --init
```

## 5) Husky + lint-staged
- Purpose: run checks before commits.
- Why useful: prevents low-quality code from entering git history.
- Start:
```bash
npm install -D husky lint-staged
```

## 6) Vitest (or Jest)
- Purpose: unit/integration testing.
- Why useful: protects behavior during refactors.
- Start (Vitest):
```bash
npm install -D vitest
```

## 7) Testing Library
- Purpose: UI testing from user perspective.
- Why useful: more reliable tests than implementation-detail tests.
- Start (React example):
```bash
npm install -D @testing-library/react @testing-library/jest-dom
```

## 8) Playwright (E2E)
- Purpose: end-to-end browser testing.
- Why useful: verifies real user flows across pages.
- Start:
```bash
npm install -D @playwright/test
npx playwright install
```

## 9) Lighthouse
- Purpose: performance/accessibility/best-practices audits.
- Why useful: measurable optimization targets for frontend quality.
- Start:
```bash
npx lighthouse https://example.com --view
```

## 10) Bundle Analyzer
- Purpose: inspect bundle size.
- Why useful: finds heavy dependencies and code-splitting opportunities.
- Common options:
- `webpack-bundle-analyzer` (Webpack)
- `rollup-plugin-visualizer` (Vite/Rollup)

## 11) Sentry (error monitoring)
- Purpose: runtime error tracking in production.
- Why useful: faster debugging with stack traces and context.
- Start:
```bash
npm install @sentry/browser
```

## Recommended Starter Stack for Students
1. `Prettier` + `ESLint` + `Stylelint`
2. `TypeScript`
3. `Vitest` + `Testing Library`
4. `Husky` + `lint-staged`
5. `Lighthouse`

This combination gives fast feedback on formatting, quality, correctness, and performance.
