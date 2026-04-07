import React from 'react';
import { describe, it, expect, vi, beforeEach } from 'vitest';
import { render, firePress } from './test-utils';
import { InvitationsPage } from '../pages/InvitationsPage';

const mockUseMyInvitations = vi.fn();
const mockUseAcceptInvitation = vi.fn();
const mockUseDeclineInvitation = vi.fn();

vi.mock('@sudobility/entity_client', () => ({
  useMyInvitations: (...args: any[]) => mockUseMyInvitations(...args),
  useAcceptInvitation: (...args: any[]) => mockUseAcceptInvitation(...args),
  useDeclineInvitation: (...args: any[]) => mockUseDeclineInvitation(...args),
}));

const mockClient = {} as any;

describe('InvitationsPage', () => {
  beforeEach(() => {
    vi.clearAllMocks();
    mockUseAcceptInvitation.mockReturnValue({
      mutateAsync: vi.fn(),
      isPending: false,
    });
    mockUseDeclineInvitation.mockReturnValue({
      mutateAsync: vi.fn(),
      isPending: false,
    });
  });

  it('should render loading state', async () => {
    mockUseMyInvitations.mockReturnValue({
      data: undefined,
      isLoading: true,
      isError: false,
      error: null,
      refetch: vi.fn(),
    });

    const { queryByText } = await render(
      <InvitationsPage client={mockClient} />
    );

    expect(queryByText('Invitations')).toBeNull();
  });

  it('should render error state with message', async () => {
    mockUseMyInvitations.mockReturnValue({
      data: undefined,
      isLoading: false,
      isError: true,
      error: { message: 'Server error' },
      refetch: vi.fn(),
    });

    const { getByText } = await render(<InvitationsPage client={mockClient} />);

    expect(getByText('Server error')).toBeTruthy();
    expect(getByText('Retry')).toBeTruthy();
  });

  it('should call refetch when Retry is pressed', async () => {
    const refetch = vi.fn();
    mockUseMyInvitations.mockReturnValue({
      data: undefined,
      isLoading: false,
      isError: true,
      error: { message: 'Error' },
      refetch,
    });

    const { getByText } = await render(<InvitationsPage client={mockClient} />);

    firePress(getByText('Retry'));
    expect(refetch).toHaveBeenCalled();
  });

  it('should render empty state', async () => {
    mockUseMyInvitations.mockReturnValue({
      data: [],
      isLoading: false,
      isError: false,
      error: null,
      refetch: vi.fn(),
    });

    const { getByText, queryByText } = await render(
      <InvitationsPage client={mockClient} />
    );

    expect(getByText('Invitations')).toBeTruthy();
    expect(getByText('No pending invitations')).toBeTruthy();
    // Badge should not be shown when empty
    expect(queryByText('0')).toBeNull();
  });

  it('should render invitation list with actions', async () => {
    mockUseMyInvitations.mockReturnValue({
      data: [
        {
          id: 'inv1',
          token: 'tok1',
          role: 'MEMBER',
          entity: { displayName: 'Acme Corp' },
        },
        {
          id: 'inv2',
          token: 'tok2',
          role: 'MANAGER',
          entity: { displayName: 'Widgets Inc' },
        },
      ],
      isLoading: false,
      isError: false,
      error: null,
      refetch: vi.fn(),
    });

    const { getByText, getAllByText } = await render(
      <InvitationsPage client={mockClient} />
    );

    expect(getByText('Acme Corp')).toBeTruthy();
    expect(getByText('Widgets Inc')).toBeTruthy();
    expect(getAllByText('Accept').length).toBe(2);
    expect(getAllByText('Decline').length).toBe(2);
  });

  it('should show count badge when invitations exist', async () => {
    mockUseMyInvitations.mockReturnValue({
      data: [
        {
          id: 'inv1',
          token: 'tok1',
          role: 'MEMBER',
          entity: { displayName: 'Acme Corp' },
        },
      ],
      isLoading: false,
      isError: false,
      error: null,
      refetch: vi.fn(),
    });

    const { getByText } = await render(<InvitationsPage client={mockClient} />);

    expect(getByText('1')).toBeTruthy();
  });

  it('should show fallback name when entity has no displayName', async () => {
    mockUseMyInvitations.mockReturnValue({
      data: [{ id: 'inv1', token: 'tok1', role: 'MEMBER', entity: null }],
      isLoading: false,
      isError: false,
      error: null,
      refetch: vi.fn(),
    });

    const { getByText } = await render(<InvitationsPage client={mockClient} />);

    expect(getByText('Organization')).toBeTruthy();
  });

  it('should call accept handler when Accept is pressed', async () => {
    const mutateAsync = vi.fn().mockResolvedValue(undefined);
    mockUseAcceptInvitation.mockReturnValue({
      mutateAsync,
      isPending: false,
    });
    mockUseMyInvitations.mockReturnValue({
      data: [
        {
          id: 'inv1',
          token: 'tok1',
          role: 'MEMBER',
          entity: { displayName: 'Acme Corp' },
        },
      ],
      isLoading: false,
      isError: false,
      error: null,
      refetch: vi.fn(),
    });

    const onInvitationAccepted = vi.fn();
    const { getByText } = await render(
      <InvitationsPage
        client={mockClient}
        onInvitationAccepted={onInvitationAccepted}
      />
    );

    firePress(getByText('Accept'));
    expect(mutateAsync).toHaveBeenCalledWith('tok1');
  });
});
