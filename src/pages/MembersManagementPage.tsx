import React, { useState } from 'react';
import {
  View,
  Text,
  FlatList,
  TouchableOpacity,
  TextInput,
  ActivityIndicator,
  StyleSheet,
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
      <View style={styles.center}>
        <ActivityIndicator size='large' />
      </View>
    );
  }

  return (
    <View style={styles.container}>
      {/* Members Section */}
      <View style={styles.sectionHeader}>
        <Text style={styles.sectionTitle}>Members</Text>
        {canManage && (
          <TouchableOpacity
            style={styles.inviteButton}
            onPress={() => setShowInvite(!showInvite)}
          >
            <Text style={styles.inviteButtonText}>Invite</Text>
          </TouchableOpacity>
        )}
      </View>

      {showInvite && (
        <View style={styles.inviteForm}>
          <TextInput
            style={styles.input}
            placeholder='Email address'
            value={inviteEmail}
            onChangeText={setInviteEmail}
            keyboardType='email-address'
            autoCapitalize='none'
            autoFocus
          />
          <View style={styles.roleSelector}>
            <TouchableOpacity
              style={[
                styles.roleOption,
                inviteRole === EntityRole.MEMBER && styles.roleOptionActive,
              ]}
              onPress={() => setInviteRole(EntityRole.MEMBER)}
            >
              <Text
                style={[
                  styles.roleOptionText,
                  inviteRole === EntityRole.MEMBER &&
                    styles.roleOptionTextActive,
                ]}
              >
                Member
              </Text>
            </TouchableOpacity>
            <TouchableOpacity
              style={[
                styles.roleOption,
                inviteRole === EntityRole.MANAGER && styles.roleOptionActive,
              ]}
              onPress={() => setInviteRole(EntityRole.MANAGER)}
            >
              <Text
                style={[
                  styles.roleOptionText,
                  inviteRole === EntityRole.MANAGER &&
                    styles.roleOptionTextActive,
                ]}
              >
                Manager
              </Text>
            </TouchableOpacity>
          </View>
          <View style={styles.formButtons}>
            <TouchableOpacity
              onPress={() => {
                setShowInvite(false);
                setInviteEmail('');
              }}
            >
              <Text style={styles.formCancelText}>Cancel</Text>
            </TouchableOpacity>
            <TouchableOpacity
              style={[
                styles.formSubmitButton,
                (!inviteEmail.trim() || createInvitation.isPending) &&
                  styles.buttonDisabled,
              ]}
              onPress={handleInvite}
              disabled={!inviteEmail.trim() || createInvitation.isPending}
            >
              <Text style={styles.formSubmitText}>
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
          <View style={styles.memberItem}>
            <View style={styles.memberInfo}>
              <Text style={styles.memberName}>{item.userId}</Text>
              <Text style={styles.memberRole}>{item.role}</Text>
            </View>
            {canManage && item.role !== EntityRole.OWNER && (
              <View style={styles.memberActions}>
                <TouchableOpacity
                  style={styles.actionButton}
                  onPress={() =>
                    handleRoleChange(
                      item.id,
                      item.role === EntityRole.MANAGER
                        ? EntityRole.MEMBER
                        : EntityRole.MANAGER
                    )
                  }
                >
                  <Text style={styles.actionText}>
                    {item.role === EntityRole.MANAGER ? 'Demote' : 'Promote'}
                  </Text>
                </TouchableOpacity>
                <TouchableOpacity
                  style={styles.removeButton}
                  onPress={() => handleRemoveMember(item.id, item.userId)}
                >
                  <Text style={styles.removeText}>Remove</Text>
                </TouchableOpacity>
              </View>
            )}
          </View>
        )}
        ListEmptyComponent={
          <View style={styles.empty}>
            <Text style={styles.emptyText}>No members</Text>
          </View>
        }
        ListFooterComponent={
          invitations && invitations.length > 0 ? (
            <View>
              <View style={styles.sectionHeader}>
                <Text style={styles.sectionTitle}>Pending Invitations</Text>
              </View>
              {invitations.map((inv: any) => (
                <View key={inv.id} style={styles.memberItem}>
                  <View style={styles.memberInfo}>
                    <Text style={styles.memberName}>{inv.email}</Text>
                    <Text style={styles.invitationStatus}>
                      Pending - {inv.role}
                    </Text>
                  </View>
                  {canManage && (
                    <TouchableOpacity
                      style={styles.removeButton}
                      onPress={() => handleCancelInvitation(inv.id)}
                    >
                      <Text style={styles.removeText}>Cancel</Text>
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

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#fff' },
  center: { flex: 1, justifyContent: 'center', alignItems: 'center' },
  sectionHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    padding: 16,
    borderBottomWidth: 1,
    borderBottomColor: '#e5e5e5',
  },
  sectionTitle: { fontSize: 18, fontWeight: '700', color: '#111' },
  inviteButton: {
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 6,
    backgroundColor: '#2563eb',
  },
  inviteButtonText: { color: '#fff', fontWeight: '600', fontSize: 14 },
  inviteForm: {
    padding: 16,
    borderBottomWidth: 1,
    borderBottomColor: '#e5e5e5',
    backgroundColor: '#f9fafb',
  },
  input: {
    borderWidth: 1,
    borderColor: '#d1d5db',
    borderRadius: 8,
    padding: 12,
    fontSize: 16,
    backgroundColor: '#fff',
  },
  roleSelector: { flexDirection: 'row', marginTop: 12, gap: 8 },
  roleOption: {
    paddingHorizontal: 16,
    paddingVertical: 8,
    borderRadius: 6,
    borderWidth: 1,
    borderColor: '#d1d5db',
  },
  roleOptionActive: { borderColor: '#2563eb', backgroundColor: '#eff6ff' },
  roleOptionText: { color: '#6b7280', fontWeight: '600' },
  roleOptionTextActive: { color: '#2563eb' },
  formButtons: {
    flexDirection: 'row',
    justifyContent: 'flex-end',
    marginTop: 12,
    gap: 12,
    alignItems: 'center',
  },
  formCancelText: { color: '#6b7280', fontWeight: '600' },
  formSubmitButton: {
    paddingHorizontal: 16,
    paddingVertical: 8,
    borderRadius: 6,
    backgroundColor: '#2563eb',
  },
  formSubmitText: { color: '#fff', fontWeight: '600' },
  buttonDisabled: { opacity: 0.5 },
  memberItem: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    padding: 16,
    borderBottomWidth: 1,
    borderBottomColor: '#f3f4f6',
  },
  memberInfo: { flex: 1 },
  memberName: { fontSize: 15, fontWeight: '600', color: '#111' },
  memberRole: {
    fontSize: 13,
    color: '#6b7280',
    marginTop: 2,
    textTransform: 'capitalize',
  },
  invitationStatus: { fontSize: 13, color: '#f59e0b', marginTop: 2 },
  memberActions: { flexDirection: 'row', gap: 8 },
  actionButton: {
    paddingHorizontal: 10,
    paddingVertical: 6,
    borderRadius: 4,
    borderWidth: 1,
    borderColor: '#d1d5db',
  },
  actionText: { fontSize: 12, fontWeight: '600', color: '#374151' },
  removeButton: {
    paddingHorizontal: 10,
    paddingVertical: 6,
    borderRadius: 4,
    borderWidth: 1,
    borderColor: '#fecaca',
  },
  removeText: { fontSize: 12, fontWeight: '600', color: '#ef4444' },
  empty: { padding: 40, alignItems: 'center' },
  emptyText: { fontSize: 14, color: '#9ca3af' },
});
