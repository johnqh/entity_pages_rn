import React from 'react';
import {
  View,
  Text,
  FlatList,
  TouchableOpacity,
  ActivityIndicator,
  StyleSheet,
  Alert,
} from 'react-native';
import type { EntityClient } from '@sudobility/entity_client';
import {
  useMyInvitations,
  useAcceptInvitation,
  useDeclineInvitation,
} from '@sudobility/entity_client';

export interface InvitationsPageProps {
  client: EntityClient;
  onInvitationAccepted?: () => void;
}

export function InvitationsPage({ client, onInvitationAccepted }: InvitationsPageProps) {
  const { data: invitations, isLoading, isError, error, refetch } = useMyInvitations(client);
  const acceptInvitation = useAcceptInvitation(client);
  const declineInvitation = useDeclineInvitation(client);

  const handleAccept = async (token: string) => {
    try {
      await acceptInvitation.mutateAsync(token);
      onInvitationAccepted?.();
    } catch (err: any) {
      Alert.alert('Error', err.message || 'Failed to accept invitation');
    }
  };

  const handleDecline = (token: string) => {
    Alert.alert(
      'Decline Invitation',
      'Are you sure you want to decline this invitation?',
      [
        { text: 'Cancel', style: 'cancel' },
        {
          text: 'Decline',
          style: 'destructive',
          onPress: () => declineInvitation.mutateAsync(token),
        },
      ]
    );
  };

  if (isLoading) {
    return (
      <View style={styles.center}>
        <ActivityIndicator size="large" />
      </View>
    );
  }

  if (isError) {
    return (
      <View style={styles.center}>
        <Text style={styles.errorText}>{error?.message || 'Failed to load'}</Text>
        <TouchableOpacity style={styles.retryButton} onPress={() => refetch()}>
          <Text style={styles.retryButtonText}>Retry</Text>
        </TouchableOpacity>
      </View>
    );
  }

  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <Text style={styles.title}>Invitations</Text>
        {invitations && invitations.length > 0 && (
          <View style={styles.badge}>
            <Text style={styles.badgeText}>{invitations.length}</Text>
          </View>
        )}
      </View>

      <FlatList
        data={invitations ?? []}
        keyExtractor={(item) => item.id}
        renderItem={({ item }) => (
          <View style={styles.invitationItem}>
            <View style={styles.invitationInfo}>
              <Text style={styles.entityName}>{item.entity?.displayName ?? 'Organization'}</Text>
              <Text style={styles.invitationRole}>Role: {item.role}</Text>
            </View>
            <View style={styles.invitationActions}>
              <TouchableOpacity
                style={styles.declineButton}
                onPress={() => handleDecline(item.token)}
                disabled={declineInvitation.isPending}
              >
                <Text style={styles.declineText}>Decline</Text>
              </TouchableOpacity>
              <TouchableOpacity
                style={[styles.acceptButton, acceptInvitation.isPending && styles.buttonDisabled]}
                onPress={() => handleAccept(item.token)}
                disabled={acceptInvitation.isPending}
              >
                <Text style={styles.acceptText}>Accept</Text>
              </TouchableOpacity>
            </View>
          </View>
        )}
        ListEmptyComponent={
          <View style={styles.empty}>
            <Text style={styles.emptyText}>No pending invitations</Text>
          </View>
        }
      />
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#fff' },
  center: { flex: 1, justifyContent: 'center', alignItems: 'center', padding: 24 },
  header: { flexDirection: 'row', alignItems: 'center', padding: 16, borderBottomWidth: 1, borderBottomColor: '#e5e5e5', gap: 8 },
  title: { fontSize: 20, fontWeight: '700', color: '#111' },
  badge: { backgroundColor: '#2563eb', borderRadius: 10, paddingHorizontal: 8, paddingVertical: 2 },
  badgeText: { color: '#fff', fontSize: 12, fontWeight: '700' },
  invitationItem: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', padding: 16, borderBottomWidth: 1, borderBottomColor: '#f3f4f6' },
  invitationInfo: { flex: 1 },
  entityName: { fontSize: 16, fontWeight: '600', color: '#111' },
  invitationRole: { fontSize: 13, color: '#6b7280', marginTop: 2, textTransform: 'capitalize' },
  invitationActions: { flexDirection: 'row', gap: 8 },
  declineButton: { paddingHorizontal: 12, paddingVertical: 8, borderRadius: 6, borderWidth: 1, borderColor: '#d1d5db' },
  declineText: { fontSize: 13, fontWeight: '600', color: '#6b7280' },
  acceptButton: { paddingHorizontal: 12, paddingVertical: 8, borderRadius: 6, backgroundColor: '#2563eb' },
  acceptText: { fontSize: 13, fontWeight: '600', color: '#fff' },
  buttonDisabled: { opacity: 0.5 },
  empty: { padding: 40, alignItems: 'center' },
  emptyText: { fontSize: 14, color: '#9ca3af' },
  errorText: { fontSize: 14, color: '#ef4444', marginBottom: 12 },
  retryButton: { paddingHorizontal: 16, paddingVertical: 8, borderRadius: 6, backgroundColor: '#2563eb' },
  retryButtonText: { color: '#fff', fontWeight: '600' },
});
