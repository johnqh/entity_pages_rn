# entity_pages_rn - AI Development Guide

## Overview

React Native page components for entity/organization management. Provides ready-to-use screens for entity listing, member management, invitations, and terms of service acceptance. Uses `@sudobility/entity_client` hooks for data fetching via TanStack Query.

- **Package**: `@sudobility/entity_pages_rn`
- **Version**: 0.0.3
- **License**: BUSL-1.1
- **Module format**: ESM (`"type": "module"`)
- **Package Manager**: Bun (never npm)
- **TypeScript**: ^5.5.0, target ES2020, bundler module resolution, strict mode
- **Build output**: `dist/` (declarations + JS)

## Project Structure

```
entity_pages_rn/
├── package.json
├── tsconfig.json              # Base TS config (strict, declarations, outDir: dist/)
├── tsconfig.build.json        # Build config (extends base, excludes tests)
└── src/
    ├── index.ts               # Barrel exports (all pages + prop types)
    └── pages/
        ├── index.ts           # Page barrel exports
        ├── EntityListPage.tsx  # Entity list with create organization form
        ├── MembersManagementPage.tsx  # Member list, role management, invitations
        ├── InvitationsPage.tsx # Pending invitations with accept/decline
        └── TosScreen.tsx      # Terms of service acceptance screen
```

## Key Exports

| Export | Type | Description |
|--------|------|-------------|
| `EntityListPage` | component | Lists user entities, create organization inline form |
| `MembersManagementPage` | component | Member list + role changes + invite form + pending invitations |
| `InvitationsPage` | component | User's pending invitations with accept/decline actions |
| `TosScreen` | component | Scrollable terms of service with accept/cancel footer |
| `EntityListPageProps` | interface | Props: `client`, `onSelectEntity?`, `onNavigateToSettings?` |
| `MembersManagementPageProps` | interface | Props: `client`, `entity`, `currentUserId` |
| `InvitationsPageProps` | interface | Props: `client`, `onInvitationAccepted?` |
| `TosScreenProps` | interface | Props: `onAccept`, `onCancel`, `isLoading?` |

## Commands

```bash
bun run build        # Build TypeScript to dist/ (uses tsconfig.build.json)
bun run typecheck    # TypeScript check (no emit)
```

## Peer Dependencies

| Package | Version | Purpose |
|---------|---------|---------|
| `react` | >=18 | React core |
| `react-native` | >=0.74 | React Native framework |
| `@tanstack/react-query` | >=5 | Data fetching and caching |
| `@sudobility/entity_client` | ^0.0.25 | Entity API client and hooks |
| `@sudobility/types` | ^1.9.55 | Shared type definitions |

## Coding Patterns

- **All pages accept an `EntityClient` instance** -- dependency injection, not context-based.
- **Uses `@sudobility/entity_client` hooks directly** -- pages call `useEntities`, `useEntityMembers`, `useCreateEntity`, etc.
- **RN StyleSheet.create for styling** -- no external styling libraries, plain React Native components.
- **Alert.alert for confirmations** -- destructive actions (remove member, decline invitation) use native alerts.
- **Loading/error/empty states** -- each page handles ActivityIndicator loading, error with retry, and empty list states.

## Related Projects

- **entity_client** (`@sudobility/entity_client`) -- provides `EntityClient` and all TanStack Query hooks used by these pages.
- **entity_pages** (`@sudobility/entity_pages`) -- web counterpart of this package.
