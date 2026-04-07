/**
 * Vitest setup file.
 *
 * Mocks for external dependencies that are peer dependencies
 * and may not be installed in the dev environment.
 */
import { vi } from 'vitest';

// Mock @sudobility/types
vi.mock('@sudobility/types', () => ({
  EntityRole: {
    OWNER: 'OWNER',
    MANAGER: 'MANAGER',
    MEMBER: 'MEMBER',
  },
}));
