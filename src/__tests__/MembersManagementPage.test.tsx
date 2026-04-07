import React from 'react';
import { describe, it, expect, vi, beforeEach } from 'vitest';
import { render, firePress } from './test-utils';
import { MembersManagementPage } from '../pages/MembersManagementPage';

const mockUseEntityMembers = vi.fn();
const mockUseUpdateMemberRole = vi.fn();
const mockUseRemoveMember = vi.fn();
const mockUseEntityInvitations = vi.fn();
const mockUseCreateInvitation = vi.fn();
const mockUseCancelInvitation = vi.fn();

vi.mock('@sudobility/entity_client', () => ({
  useEntityMembers: (...args: any[]) => mockUseEntityMembers(...args),
  useUpdateMemberRole: (...args: any[]) => mockUseUpdateMemberRole(...args),
  useRemoveMember: (...args: any[]) => mockUseRemoveMember(...args),
  useEntityInvitations: (...args: any[]) => mockUseEntityInvitations(...args),
  useCreateInvitation: (...args: any[]) => mockUseCreateInvitation(...args),
  useCancelInvitation: (...args: any[]) => mockUseCancelInvitation(...args),
}));

const mockClient = {} as any;
const ownerEntity = {
  id: 'e1',
  entitySlug: 'acme',
  displayName: 'Acme Corp',
  userRole: 'OWNER',
};
const memberEntity = {
  id: 'e1',
  entitySlug: 'acme',
  displayName: 'Acme Corp',
  userRole: 'MEMBER',
};

const defaultMutationReturn = { mutateAsync: vi.fn(), isPending: false };

describe('MembersManagementPage', () => {
  beforeEach(() => {
    vi.clearAllMocks();
    mockUseUpdateMemberRole.mockReturnValue(defaultMutationReturn);
    mockUseRemoveMember.mockReturnValue(defaultMutationReturn);
    mockUseCreateInvitation.mockReturnValue(defaultMutationReturn);
    mockUseCancelInvitation.mockReturnValue(defaultMutationReturn);
  });

  it('should render loading state', async () => {
    mockUseEntityMembers.mockReturnValue({
      data: undefined,
      isLoading: true,
    });
    mockUseEntityInvitations.mockReturnValue({
      data: undefined,
      isLoading: false,
    });

    const { queryByText } = await render(
      <MembersManagementPage
        client={mockClient}
        entity={ownerEntity}
        currentUserId='u1'
      />
    );

    expect(queryByText('Members')).toBeNull();
  });

  it('should render member list', async () => {
    mockUseEntityMembers.mockReturnValue({
      data: [
        { id: 'm1', userId: 'alice@test.com', role: 'OWNER' },
        { id: 'm2', userId: 'bob@test.com', role: 'MEMBER' },
      ],
      isLoading: false,
    });
    mockUseEntityInvitations.mockReturnValue({
      data: [],
      isLoading: false,
    });

    const { getByText } = await render(
      <MembersManagementPage
        client={mockClient}
        entity={ownerEntity}
        currentUserId='u1'
      />
    );

    expect(getByText('Members')).toBeTruthy();
    expect(getByText('alice@test.com')).toBeTruthy();
    expect(getByText('bob@test.com')).toBeTruthy();
  });

  it('should render empty state when no members', async () => {
    mockUseEntityMembers.mockReturnValue({
      data: [],
      isLoading: false,
    });
    mockUseEntityInvitations.mockReturnValue({
      data: [],
      isLoading: false,
    });

    const { getByText } = await render(
      <MembersManagementPage
        client={mockClient}
        entity={ownerEntity}
        currentUserId='u1'
      />
    );

    expect(getByText('No members')).toBeTruthy();
  });

  it('should show Invite button for owners', async () => {
    mockUseEntityMembers.mockReturnValue({
      data: [],
      isLoading: false,
    });
    mockUseEntityInvitations.mockReturnValue({
      data: [],
      isLoading: false,
    });

    const { getByText } = await render(
      <MembersManagementPage
        client={mockClient}
        entity={ownerEntity}
        currentUserId='u1'
      />
    );

    expect(getByText('Invite')).toBeTruthy();
  });

  it('should not show Invite button for non-owners', async () => {
    mockUseEntityMembers.mockReturnValue({
      data: [],
      isLoading: false,
    });
    mockUseEntityInvitations.mockReturnValue({
      data: [],
      isLoading: false,
    });

    const { queryByText } = await render(
      <MembersManagementPage
        client={mockClient}
        entity={memberEntity}
        currentUserId='u1'
      />
    );

    expect(queryByText('Invite')).toBeNull();
  });

  it('should show invite form when Invite is pressed', async () => {
    mockUseEntityMembers.mockReturnValue({
      data: [],
      isLoading: false,
    });
    mockUseEntityInvitations.mockReturnValue({
      data: [],
      isLoading: false,
    });

    const { getByText, queryByText } = await render(
      <MembersManagementPage
        client={mockClient}
        entity={ownerEntity}
        currentUserId='u1'
      />
    );

    expect(queryByText('Send Invite')).toBeNull();

    firePress(getByText('Invite'));

    expect(getByText('Member')).toBeTruthy();
    expect(getByText('Manager')).toBeTruthy();
    expect(getByText('Send Invite')).toBeTruthy();
    expect(getByText('Cancel')).toBeTruthy();
  });

  it('should show Promote button for MEMBER role members when owner', async () => {
    mockUseEntityMembers.mockReturnValue({
      data: [{ id: 'm1', userId: 'bob@test.com', role: 'MEMBER' }],
      isLoading: false,
    });
    mockUseEntityInvitations.mockReturnValue({
      data: [],
      isLoading: false,
    });

    const { getByText } = await render(
      <MembersManagementPage
        client={mockClient}
        entity={ownerEntity}
        currentUserId='u1'
      />
    );

    expect(getByText('Promote')).toBeTruthy();
    expect(getByText('Remove')).toBeTruthy();
  });

  it('should show Demote button for MANAGER role members when owner', async () => {
    mockUseEntityMembers.mockReturnValue({
      data: [{ id: 'm1', userId: 'bob@test.com', role: 'MANAGER' }],
      isLoading: false,
    });
    mockUseEntityInvitations.mockReturnValue({
      data: [],
      isLoading: false,
    });

    const { getByText } = await render(
      <MembersManagementPage
        client={mockClient}
        entity={ownerEntity}
        currentUserId='u1'
      />
    );

    expect(getByText('Demote')).toBeTruthy();
  });

  it('should not show action buttons for non-owners', async () => {
    mockUseEntityMembers.mockReturnValue({
      data: [{ id: 'm1', userId: 'bob@test.com', role: 'MEMBER' }],
      isLoading: false,
    });
    mockUseEntityInvitations.mockReturnValue({
      data: [],
      isLoading: false,
    });

    const { queryByText } = await render(
      <MembersManagementPage
        client={mockClient}
        entity={memberEntity}
        currentUserId='u1'
      />
    );

    expect(queryByText('Promote')).toBeNull();
    expect(queryByText('Remove')).toBeNull();
  });

  it('should not show action buttons for OWNER role members', async () => {
    mockUseEntityMembers.mockReturnValue({
      data: [{ id: 'm1', userId: 'owner@test.com', role: 'OWNER' }],
      isLoading: false,
    });
    mockUseEntityInvitations.mockReturnValue({
      data: [],
      isLoading: false,
    });

    const { queryByText } = await render(
      <MembersManagementPage
        client={mockClient}
        entity={ownerEntity}
        currentUserId='u1'
      />
    );

    expect(queryByText('Promote')).toBeNull();
    expect(queryByText('Demote')).toBeNull();
  });

  it('should render pending invitations section', async () => {
    mockUseEntityMembers.mockReturnValue({
      data: [{ id: 'm1', userId: 'alice@test.com', role: 'OWNER' }],
      isLoading: false,
    });
    mockUseEntityInvitations.mockReturnValue({
      data: [{ id: 'inv1', email: 'carol@test.com', role: 'MEMBER' }],
      isLoading: false,
    });

    const { getByText } = await render(
      <MembersManagementPage
        client={mockClient}
        entity={ownerEntity}
        currentUserId='u1'
      />
    );

    expect(getByText('Pending Invitations')).toBeTruthy();
    expect(getByText('carol@test.com')).toBeTruthy();
    expect(getByText('Pending - MEMBER')).toBeTruthy();
  });
});
