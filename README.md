# DocuMind AI

A frontend-only foundation for a document question-answering workspace. The current app uses sample data and local UI state; PDF selection is validated in the browser but is not uploaded or processed.

## Prerequisites

- Node.js 20.19+ or 22.12+
- npm 10+

## Getting started

```sh
npm install
npm run dev
```

Vite prints the local development URL after startup.

## Commands

- `npm run dev` starts the development server.
- `npm run typecheck` checks TypeScript without emitting files.
- `npm run build` type-checks and creates a production build in `dist/`.
- `npm run preview` serves the production build locally.

## Project structure

```text
src/
  app/                 Router and shared workspace state
  components/
    layout/            Responsive application shell
    ui/                Reusable upload and status controls
  features/
    conversations/    Sample conversation history
    dashboard/         Dashboard page
    documents/         Document types, sample data, list, and page
  lib/                 Formatting helpers
  styles/              Tailwind entry point and global styles
```

The document and conversation modules own their domain types and sample data. A lightweight React context shares the in-memory document list between routes, so summary counts and session-only removal stay in sync without introducing a data-fetching layer before an API exists.