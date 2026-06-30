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
import { useEntities, useCreateEntity } from '@sudobility/entity_client';
import { designTokens } from '@sudobility/design';

const { size, weight } = designTokens.typography;

export interface EntityListPageProps {
  client: EntityClient;
  onSelectEntity?: (entity: any) => void;
  onNavigateToSettings?: (entitySlug: string) => void;
}

export function EntityListPage({
  client,
  onSelectEntity,
  onNavigateToSettings: _onNavigateToSettings,
}: EntityListPageProps) {
  const {
    data: entities,
    isLoading,
    isError,
    error,
    refetch,
  } = useEntities(client);
  const createEntity = useCreateEntity(client);
  const [showCreate, setShowCreate] = useState(false);
  const [newName, setNewName] = useState('');

  const handleCreate = async () => {
    if (!newName.trim()) return;
    try {
      await createEntity.mutateAsync({ displayName: newName.trim() });
      setNewName('');
      setShowCreate(false);
    } catch (err: any) {
      Alert.alert('Error', err.message || 'Failed to create organization');
    }
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
        <Text className={[size.sm, 'text-destructive mb-3'].join(' ')}>
          {error?.message || 'Failed to load'}
        </Text>
        <TouchableOpacity
          className='px-4 py-2 rounded-md bg-primary'
          onPress={() => refetch()}
        >
          <Text
            className={['text-primary-foreground', weight.semibold].join(' ')}
          >
            Retry
          </Text>
        </TouchableOpacity>
      </View>
    );
  }

  return (
    <View className='flex-1 bg-background'>
      <View className='flex-row justify-between items-center p-4 border-b border-border'>
        <Text className={[size.xl, weight.bold, 'text-foreground'].join(' ')}>
          Organizations
        </Text>
        <TouchableOpacity
          className='px-3 py-1.5 rounded-md bg-primary'
          onPress={() => setShowCreate(!showCreate)}
        >
          <Text
            className={[
              'text-primary-foreground',
              weight.semibold,
              size.sm,
            ].join(' ')}
          >
            + New
          </Text>
        </TouchableOpacity>
      </View>

      {showCreate && (
        <View className='p-4 border-b border-border bg-muted'>
          <TextInput
            className={[
              'border border-input rounded-lg p-3 bg-background',
              size.base,
            ].join(' ')}
            placeholder='Organization name'
            value={newName}
            onChangeText={setNewName}
            autoFocus
          />
          <View className='flex-row justify-end mt-3 gap-2'>
            <TouchableOpacity
              className='px-4 py-2 rounded-md'
              onPress={() => {
                setShowCreate(false);
                setNewName('');
              }}
            >
              <Text
                className={['text-muted-foreground', weight.semibold].join(' ')}
              >
                Cancel
              </Text>
            </TouchableOpacity>
            <TouchableOpacity
              className={[
                'px-4 py-2 rounded-md bg-primary',
                createEntity.isPending ? 'opacity-50' : '',
              ]
                .filter(Boolean)
                .join(' ')}
              onPress={handleCreate}
              disabled={createEntity.isPending || !newName.trim()}
            >
              <Text
                className={['text-primary-foreground', weight.semibold].join(
                  ' '
                )}
              >
                {createEntity.isPending ? 'Creating...' : 'Create'}
              </Text>
            </TouchableOpacity>
          </View>
        </View>
      )}

      <FlatList
        data={entities ?? []}
        keyExtractor={item => item.id}
        renderItem={({ item }) => (
          <TouchableOpacity
            className='flex-row justify-between items-center p-4 border-b border-border'
            onPress={() => onSelectEntity?.(item)}
          >
            <View className='flex-1'>
              <Text
                className={[size.base, weight.semibold, 'text-foreground'].join(
                  ' '
                )}
              >
                {item.displayName}
              </Text>
              <Text className='text-[13px] text-muted-foreground mt-0.5'>
                @{item.entitySlug}
              </Text>
            </View>
            <Text
              className={[
                size.xs,
                weight.semibold,
                'text-primary bg-primary/10 px-2 py-1 rounded overflow-hidden capitalize',
              ].join(' ')}
            >
              {item.userRole}
            </Text>
          </TouchableOpacity>
        )}
        ListEmptyComponent={
          <View className='p-10 items-center'>
            <Text className={[size.sm, 'text-muted-foreground'].join(' ')}>
              No organizations yet
            </Text>
          </View>
        }
      />
    </View>
  );
}
