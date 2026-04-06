import React from 'react';
import {
  View,
  Text,
  FlatList,
  TouchableOpacity,
  ActivityIndicator,
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

export function InvitationsPage({
  client,
  onInvitationAccepted,
}: InvitationsPageProps) {
  const {
    data: invitations,
    isLoading,
    isError,
    error,
    refetch,
  } = useMyInvitations(client);
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
      <View className='flex-1 justify-center items-center p-6'>
        <ActivityIndicator size='large' />
      </View>
    );
  }

  if (isError) {
    return (
      <View className='flex-1 justify-center items-center p-6'>
        <Text className='text-sm text-red-500 mb-3'>
          {error?.message || 'Failed to load'}
        </Text>
        <TouchableOpacity
          className='px-4 py-2 rounded-md bg-blue-600'
          onPress={() => refetch()}
        >
          <Text className='text-white font-semibold'>Retry</Text>
        </TouchableOpacity>
      </View>
    );
  }

  return (
    <View className='flex-1 bg-white'>
      <View className='flex-row items-center p-4 border-b border-neutral-200 gap-2'>
        <Text className='text-xl font-bold text-gray-900'>Invitations</Text>
        {invitations && invitations.length > 0 && (
          <View className='bg-blue-600 rounded-[10px] px-2 py-0.5'>
            <Text className='text-white text-xs font-bold'>
              {invitations.length}
            </Text>
          </View>
        )}
      </View>

      <FlatList
        data={invitations ?? []}
        keyExtractor={item => item.id}
        renderItem={({ item }) => (
          <View className='flex-row justify-between items-center p-4 border-b border-gray-100'>
            <View className='flex-1'>
              <Text className='text-base font-semibold text-gray-900'>
                {item.entity?.displayName ?? 'Organization'}
              </Text>
              <Text className='text-[13px] text-gray-500 mt-0.5 capitalize'>
                Role: {item.role}
              </Text>
            </View>
            <View className='flex-row gap-2'>
              <TouchableOpacity
                className='px-3 py-2 rounded-md border border-gray-300'
                onPress={() => handleDecline(item.token)}
                disabled={declineInvitation.isPending}
              >
                <Text className='text-[13px] font-semibold text-gray-500'>
                  Decline
                </Text>
              </TouchableOpacity>
              <TouchableOpacity
                className={[
                  'px-3 py-2 rounded-md bg-blue-600',
                  acceptInvitation.isPending ? 'opacity-50' : '',
                ]
                  .filter(Boolean)
                  .join(' ')}
                onPress={() => handleAccept(item.token)}
                disabled={acceptInvitation.isPending}
              >
                <Text className='text-[13px] font-semibold text-white'>
                  Accept
                </Text>
              </TouchableOpacity>
            </View>
          </View>
        )}
        ListEmptyComponent={
          <View className='p-10 items-center'>
            <Text className='text-sm text-gray-400'>
              No pending invitations
            </Text>
          </View>
        }
      />
    </View>
  );
}
