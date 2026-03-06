# Tests

This directory contains the automated test suite for the Agentic web platform.

## Structure

```
tests/
├── unit/           Unit tests for individual modules
│   ├── services/   AI service layer tests
│   ├── lib/        Library utility tests
│   └── config/     Configuration tests
├── integration/    Integration tests for API routes
└── e2e/            End-to-end tests (Playwright)
```

## Running Tests

```bash
npm run test
```

## Writing Tests

Tests use Jest. Follow these conventions:
- Test files: `*.test.ts` or `*.spec.ts`
- Mocks: `__mocks__/` directories adjacent to the module being mocked
- Fixtures: `tests/fixtures/`

## Coverage

Run with coverage:

```bash
npm run test -- --coverage
```
