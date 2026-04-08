import React, { useState } from 'react';
import {
  View,
  Text,
  FlatList,
  TouchableOpacity,
  TextInput,
  ActivityIndicator,
  Alert,
} from 'react-native';
import type { EntityClient } from '@sudobility/entity_client';
import {
  useEntityMembers,
  useUpdateMemberRole,
  useRemoveMember,
  useEntityInvitations,
  useCreateInvitation,
  useCancelInvitation,
} from '@sudobility/entity_client';
import { EntityRole } from '@sudobility/types';
import { designTokens } from '@sudobility/design';

const { size, weight } = designTokens.typography;

export interface MembersManagementPageProps {
  client: EntityClient;
  entity: {
    id: string;
    entitySlug: string;
    displayName: string;
    userRole: string;
  };
  currentUserId: string;
}

export function MembersManagementPage({
  client,
  entity,
  currentUserId: _currentUserId,
}: MembersManagementPageProps) {
  const { data: members, isLoading: membersLoading } = useEntityMembers(
    client,
    entity.entitySlug
  );
  const { data: invitations, isLoading: invitationsLoading } =
    useEntityInvitations(client, entity.entitySlug);
  const updateRole = useUpdateMemberRole(client);
  const removeMember = useRemoveMember(client);
  const createInvitation = useCreateInvitation(client);
  const cancelInvitation = useCancelInvitation(client);

  const [showInvite, setShowInvite] = useState(false);
  const [inviteEmail, setInviteEmail] = useState('');
  const [inviteRole, setInviteRole] = useState<EntityRole>(EntityRole.MEMBER);

  const canManage =
    entity.userRole === EntityRole.OWNER || entity.userRole === 'owner';
  const isLoading = membersLoading || invitationsLoading;

  const handleRemoveMember = (memberId: string, name: string) => {
    Alert.alert('Remove Member', `Remove ${name} from ${entity.displayName}?`, [
      { text: 'Cancel', style: 'cancel' },
      {
        text: 'Remove',
        style: 'destructive',
        onPress: () =>
          removeMember.mutateAsync({ entitySlug: entity.entitySlug, memberId }),
      },
    ]);
  };

  const handleRoleChange = (memberId: string, newRole: EntityRole) => {
    updateRole.mutateAsync({
      entitySlug: entity.entitySlug,
      memberId,
      role: newRole,
    });
  };

  const handleInvite = async () => {
    if (!inviteEmail.trim()) return;
    try {
      await createInvitation.mutateAsync({
        entitySlug: entity.entitySlug,
        request: { email: inviteEmail.trim(), role: inviteRole },
      });
      setInviteEmail('');
      setShowInvite(false);
    } catch (err: any) {
      Alert.alert('Error', err.message || 'Failed to send invitation');
    }
  };

  const handleCancelInvitation = (invitationId: string) => {
    Alert.alert('Cancel Invitation', 'Cancel this invitation?', [
      { text: 'No', style: 'cancel' },
      {
        text: 'Yes',
        style: 'destructive',
        onPress: () =>
          cancelInvitation.mutateAsync({
            entitySlug: entity.entitySlug,
            invitationId,
          }),
      },
    ]);
  };

  if (isLoading) {
    return (
      <View className='flex-1 justify-center items-center'>
        <ActivityIndicator size='large' />
      </View>
    );
  }

  return (
    <View className='flex-1 bg-white'>
      {/* Members Section */}
      <View className='flex-row justify-between items-center p-4 border-b border-neutral-200'>
        <Text className={[size.lg, weight.bold, 'text-gray-900'].join(' ')}>
          Members
        </Text>
        {canManage && (
          <TouchableOpacity
            className='px-3 py-1.5 rounded-md bg-blue-600'
            onPress={() => setShowInvite(!showInvite)}
          >
            <Text
              className={['text-white', weight.semibold, size.sm].join(' ')}
            >
              Invite
            </Text>
          </TouchableOpacity>
        )}
      </View>

      {showInvite && (
        <View className='p-4 border-b border-neutral-200 bg-gray-50'>
          <TextInput
            className={[
              'border border-gray-300 rounded-lg p-3 bg-white',
              size.base,
            ].join(' ')}
            placeholder='Email address'
            value={inviteEmail}
            onChangeText={setInviteEmail}
            keyboardType='email-address'
            autoCapitalize='none'
            autoFocus
          />
          <View className='flex-row mt-3 gap-2'>
            <TouchableOpacity
              className={[
                'px-4 py-2 rounded-md border',
                inviteRole === EntityRole.MEMBER
                  ? 'border-blue-600 bg-blue-50'
                  : 'border-gray-300',
              ].join(' ')}
              onPress={() => setInviteRole(EntityRole.MEMBER)}
            >
              <Text
                className={[
                  weight.semibold,
                  inviteRole === EntityRole.MEMBER
                    ? 'text-blue-600'
                    : 'text-gray-500',
                ].join(' ')}
              >
                Member
              </Text>
            </TouchableOpacity>
            <TouchableOpacity
              className={[
                'px-4 py-2 rounded-md border',
                inviteRole === EntityRole.MANAGER
                  ? 'border-blue-600 bg-blue-50'
                  : 'border-gray-300',
              ].join(' ')}
              onPress={() => setInviteRole(EntityRole.MANAGER)}
            >
              <Text
                className={[
                  weight.semibold,
                  inviteRole === EntityRole.MANAGER
                    ? 'text-blue-600'
                    : 'text-gray-500',
                ].join(' ')}
              >
                Manager
              </Text>
            </TouchableOpacity>
          </View>
          <View className='flex-row justify-end mt-3 gap-3 items-center'>
            <TouchableOpacity
              onPress={() => {
                setShowInvite(false);
                setInviteEmail('');
              }}
            >
              <Text className={['text-gray-500', weight.semibold].join(' ')}>
                Cancel
              </Text>
            </TouchableOpacity>
            <TouchableOpacity
              className={[
                'px-4 py-2 rounded-md bg-blue-600',
                !inviteEmail.trim() || createInvitation.isPending
                  ? 'opacity-50'
                  : '',
              ]
                .filter(Boolean)
                .join(' ')}
              onPress={handleInvite}
              disabled={!inviteEmail.trim() || createInvitation.isPending}
            >
              <Text className={['text-white', weight.semibold].join(' ')}>
                {createInvitation.isPending ? 'Sending...' : 'Send Invite'}
              </Text>
            </TouchableOpacity>
          </View>
        </View>
      )}

      <FlatList
        data={members ?? []}
        keyExtractor={item => item.id}
        renderItem={({ item }) => (
          <View className='flex-row justify-between items-center p-4 border-b border-gray-100'>
            <View className='flex-1'>
              <Text
                className={[
                  'text-[15px]',
                  weight.semibold,
                  'text-gray-900',
                ].join(' ')}
              >
                {item.userId}
              </Text>
              <Text className='text-[13px] text-gray-500 mt-0.5 capitalize'>
                {item.role}
              </Text>
            </View>
            {canManage && item.role !== EntityRole.OWNER && (
              <View className='flex-row gap-2'>
                <TouchableOpacity
                  className='px-2.5 py-1.5 rounded border border-gray-300'
                  onPress={() =>
                    handleRoleChange(
                      item.id,
                      item.role === EntityRole.MANAGER
                        ? EntityRole.MEMBER
                        : EntityRole.MANAGER
                    )
                  }
                >
                  <Text
                    className={[size.xs, weight.semibold, 'text-gray-700'].join(
                      ' '
                    )}
                  >
                    {item.role === EntityRole.MANAGER ? 'Demote' : 'Promote'}
                  </Text>
                </TouchableOpacity>
                <TouchableOpacity
                  className='px-2.5 py-1.5 rounded border border-red-200'
                  onPress={() => handleRemoveMember(item.id, item.userId)}
                >
                  <Text
                    className={[size.xs, weight.semibold, 'text-red-500'].join(
                      ' '
                    )}
                  >
                    Remove
                  </Text>
                </TouchableOpacity>
              </View>
            )}
          </View>
        )}
        ListEmptyComponent={
          <View className='p-10 items-center'>
            <Text className={[size.sm, 'text-gray-400'].join(' ')}>
              No members
            </Text>
          </View>
        }
        ListFooterComponent={
          invitations && invitations.length > 0 ? (
            <View>
              <View className='flex-row justify-between items-center p-4 border-b border-neutral-200'>
                <Text
                  className={[size.lg, weight.bold, 'text-gray-900'].join(' ')}
                >
                  Pending Invitations
                </Text>
              </View>
              {invitations.map((inv: any) => (
                <View
                  key={inv.id}
                  className='flex-row justify-between items-center p-4 border-b border-gray-100'
                >
                  <View className='flex-1'>
                    <Text
                      className={[
                        'text-[15px]',
                        weight.semibold,
                        'text-gray-900',
                      ].join(' ')}
                    >
                      {inv.email}
                    </Text>
                    <Text className='text-[13px] text-amber-500 mt-0.5'>
                      Pending - {inv.role}
                    </Text>
                  </View>
                  {canManage && (
                    <TouchableOpacity
                      className='px-2.5 py-1.5 rounded border border-red-200'
                      onPress={() => handleCancelInvitation(inv.id)}
                    >
                      <Text
                        className={[
                          size.xs,
                          weight.semibold,
                          'text-red-500',
                        ].join(' ')}
                      >
                        Cancel
                      </Text>
                    </TouchableOpacity>
                  )}
                </View>
              ))}
            </View>
          ) : null
        }
      />
    </View>
  );
}
