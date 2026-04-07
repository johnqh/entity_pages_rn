import React from 'react';
import { describe, it, expect, vi, beforeEach } from 'vitest';
import { render, firePress } from './test-utils';
import { EntityListPage } from '../pages/EntityListPage';

const mockUseEntities = vi.fn();
const mockUseCreateEntity = vi.fn();

vi.mock('@sudobility/entity_client', () => ({
  useEntities: (...args: any[]) => mockUseEntities(...args),
  useCreateEntity: (...args: any[]) => mockUseCreateEntity(...args),
}));

const mockClient = {} as any;

describe('EntityListPage', () => {
  beforeEach(() => {
    vi.clearAllMocks();
    mockUseCreateEntity.mockReturnValue({
      mutateAsync: vi.fn(),
      isPending: false,
    });
  });

  it('should render loading state', async () => {
    mockUseEntities.mockReturnValue({
      data: undefined,
      isLoading: true,
      isError: false,
      error: null,
      refetch: vi.fn(),
    });

    const { queryByText } = await render(
      <EntityListPage client={mockClient} />
    );

    expect(queryByText('Organizations')).toBeNull();
  });

  it('should render error state with message', async () => {
    mockUseEntities.mockReturnValue({
      data: undefined,
      isLoading: false,
      isError: true,
      error: { message: 'Network error' },
      refetch: vi.fn(),
    });

    const { getByText } = await render(<EntityListPage client={mockClient} />);

    expect(getByText('Network error')).toBeTruthy();
    expect(getByText('Retry')).toBeTruthy();
  });

  it('should render fallback error message when error has no message', async () => {
    mockUseEntities.mockReturnValue({
      data: undefined,
      isLoading: false,
      isError: true,
      error: {},
      refetch: vi.fn(),
    });

    const { getByText } = await render(<EntityListPage client={mockClient} />);

    expect(getByText('Failed to load')).toBeTruthy();
  });

  it('should render empty state', async () => {
    mockUseEntities.mockReturnValue({
      data: [],
      isLoading: false,
      isError: false,
      error: null,
      refetch: vi.fn(),
    });

    const { getByText } = await render(<EntityListPage client={mockClient} />);

    expect(getByText('Organizations')).toBeTruthy();
    expect(getByText('No organizations yet')).toBeTruthy();
  });

  it('should render entity list items', async () => {
    mockUseEntities.mockReturnValue({
      data: [
        {
          id: '1',
          displayName: 'Acme Corp',
          entitySlug: 'acme',
          userRole: 'owner',
        },
        {
          id: '2',
          displayName: 'Widgets Inc',
          entitySlug: 'widgets',
          userRole: 'member',
        },
      ],
      isLoading: false,
      isError: false,
      error: null,
      refetch: vi.fn(),
    });

    const { getByText } = await render(<EntityListPage client={mockClient} />);

    expect(getByText('Acme Corp')).toBeTruthy();
    expect(getByText('@acme')).toBeTruthy();
    expect(getByText('owner')).toBeTruthy();
    expect(getByText('Widgets Inc')).toBeTruthy();
    expect(getByText('@widgets')).toBeTruthy();
    expect(getByText('member')).toBeTruthy();
  });

  it('should render "+ New" button', async () => {
    mockUseEntities.mockReturnValue({
      data: [],
      isLoading: false,
      isError: false,
      error: null,
      refetch: vi.fn(),
    });

    const { getByText } = await render(<EntityListPage client={mockClient} />);

    expect(getByText('+ New')).toBeTruthy();
  });

  it('should show create form when "+ New" is pressed', async () => {
    mockUseEntities.mockReturnValue({
      data: [],
      isLoading: false,
      isError: false,
      error: null,
      refetch: vi.fn(),
    });

    const { getByText, queryByText } = await render(
      <EntityListPage client={mockClient} />
    );

    // Form should not be visible initially
    expect(queryByText('Cancel')).toBeNull();

    // Press "+ New"
    firePress(getByText('+ New'));

    // Form should now be visible
    expect(getByText('Cancel')).toBeTruthy();
    expect(getByText('Create')).toBeTruthy();
  });

  it('should call onSelectEntity when entity is pressed', async () => {
    const entity = {
      id: '1',
      displayName: 'Acme Corp',
      entitySlug: 'acme',
      userRole: 'owner',
    };
    mockUseEntities.mockReturnValue({
      data: [entity],
      isLoading: false,
      isError: false,
      error: null,
      refetch: vi.fn(),
    });

    const onSelectEntity = vi.fn();
    const { getByText } = await render(
      <EntityListPage client={mockClient} onSelectEntity={onSelectEntity} />
    );

    firePress(getByText('Acme Corp'));
    expect(onSelectEntity).toHaveBeenCalledWith(entity);
  });

  it('should call refetch when Retry is pressed', async () => {
    const refetch = vi.fn();
    mockUseEntities.mockReturnValue({
      data: undefined,
      isLoading: false,
      isError: true,
      error: { message: 'Failed' },
      refetch,
    });

    const { getByText } = await render(<EntityListPage client={mockClient} />);

    firePress(getByText('Retry'));
    expect(refetch).toHaveBeenCalled();
  });
});
