# @sudobility/entity_pages_rn

React Native page components for entity/organization management with TanStack Query.

## Installation

```bash
bun add @sudobility/entity_pages_rn
```

## Usage

```tsx
import {
  EntityListPage,
  MembersManagementPage,
  InvitationsPage,
  TosScreen,
} from '@sudobility/entity_pages_rn';

import { EntityClient } from '@sudobility/entity_client';

const client = new EntityClient({ baseUrl, networkClient });

// Entity list with create organization
<EntityListPage
  client={client}
  onSelectEntity={(entity) => navigate('EntityDetail', { slug: entity.entitySlug })}
/>

// Member management for a specific entity
<MembersManagementPage
  client={client}
  entity={currentEntity}
  currentUserId={userId}
/>
```

## API

### Pages

| Component | Description |
|-----------|-------------|
| `EntityListPage` | Lists user entities with inline create organization form |
| `MembersManagementPage` | Member list, role changes, invite form, pending invitations |
| `InvitationsPage` | User's pending invitations with accept/decline actions |
| `TosScreen` | Scrollable terms of service with accept/cancel footer |

### Props

| Interface | Key Props |
|-----------|-----------|
| `EntityListPageProps` | `client`, `onSelectEntity?`, `onNavigateToSettings?` |
| `MembersManagementPageProps` | `client`, `entity`, `currentUserId` |
| `InvitationsPageProps` | `client`, `onInvitationAccepted?` |
| `TosScreenProps` | `onAccept`, `onCancel`, `isLoading?` |

### Peer Dependencies

- `react` >= 18
- `react-native` >= 0.74
- `@tanstack/react-query` >= 5
- `@sudobility/entity_client` ^0.0.25
- `@sudobility/types` ^1.9.55

## Development

```bash
bun run build        # Build TypeScript to dist/
bun run typecheck    # TypeScript check (no emit)
```

## License

BUSL-1.1
