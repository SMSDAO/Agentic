# Tests

This directory is reserved for the automated test suite for the Agentic web platform.

## Structure

```
tests/
├── unit/           Unit tests for individual modules
│   ├── services/   AI service layer tests
│   ├── lib/        Library utility tests
│   └── config/     Configuration tests
├── integration/    Integration tests for API routes
└── e2e/            End-to-end tests
```

## Status

Tests have not been added yet. A test runner (e.g. Jest or Vitest) needs to be configured before adding test files. When a test runner is chosen:
- Add it to `devDependencies` in `package.json`
- Add a `test` script to `package.json`
- Update this README with the chosen conventions

## Planned Conventions

- Test files: `*.test.ts` or `*.spec.ts`
- Mocks: `__mocks__/` directories adjacent to the module being mocked
- Fixtures: `tests/fixtures/`
