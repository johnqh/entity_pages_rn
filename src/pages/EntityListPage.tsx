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
  useEntities,
  useCreateEntity,
} from '@sudobility/entity_client';

export interface EntityListPageProps {
  client: EntityClient;
  onSelectEntity?: (entity: any) => void;
  onNavigateToSettings?: (entitySlug: string) => void;
}

export function EntityListPage({
  client,
  onSelectEntity,
  onNavigateToSettings,
}: EntityListPageProps) {
  const { data: entities, isLoading, isError, error, refetch } = useEntities(client);
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
        <Text style={styles.title}>Organizations</Text>
        <TouchableOpacity
          style={styles.createButton}
          onPress={() => setShowCreate(!showCreate)}
        >
          <Text style={styles.createButtonText}>+ New</Text>
        </TouchableOpacity>
      </View>

      {showCreate && (
        <View style={styles.createForm}>
          <TextInput
            style={styles.input}
            placeholder="Organization name"
            value={newName}
            onChangeText={setNewName}
            autoFocus
          />
          <View style={styles.formButtons}>
            <TouchableOpacity
              style={styles.formCancelButton}
              onPress={() => { setShowCreate(false); setNewName(''); }}
            >
              <Text style={styles.formCancelText}>Cancel</Text>
            </TouchableOpacity>
            <TouchableOpacity
              style={[styles.formSubmitButton, createEntity.isPending && styles.buttonDisabled]}
              onPress={handleCreate}
              disabled={createEntity.isPending || !newName.trim()}
            >
              <Text style={styles.formSubmitText}>
                {createEntity.isPending ? 'Creating...' : 'Create'}
              </Text>
            </TouchableOpacity>
          </View>
        </View>
      )}

      <FlatList
        data={entities ?? []}
        keyExtractor={(item) => item.id}
        renderItem={({ item }) => (
          <TouchableOpacity
            style={styles.entityItem}
            onPress={() => onSelectEntity?.(item)}
          >
            <View style={styles.entityInfo}>
              <Text style={styles.entityName}>{item.displayName}</Text>
              <Text style={styles.entitySlug}>@{item.entitySlug}</Text>
            </View>
            <Text style={styles.roleBadge}>{item.userRole}</Text>
          </TouchableOpacity>
        )}
        ListEmptyComponent={
          <View style={styles.empty}>
            <Text style={styles.emptyText}>No organizations yet</Text>
          </View>
        }
      />
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#fff' },
  center: { flex: 1, justifyContent: 'center', alignItems: 'center', padding: 24 },
  header: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', padding: 16, borderBottomWidth: 1, borderBottomColor: '#e5e5e5' },
  title: { fontSize: 20, fontWeight: '700', color: '#111' },
  createButton: { paddingHorizontal: 12, paddingVertical: 6, borderRadius: 6, backgroundColor: '#2563eb' },
  createButtonText: { color: '#fff', fontWeight: '600', fontSize: 14 },
  createForm: { padding: 16, borderBottomWidth: 1, borderBottomColor: '#e5e5e5', backgroundColor: '#f9fafb' },
  input: { borderWidth: 1, borderColor: '#d1d5db', borderRadius: 8, padding: 12, fontSize: 16, backgroundColor: '#fff' },
  formButtons: { flexDirection: 'row', justifyContent: 'flex-end', marginTop: 12, gap: 8 },
  formCancelButton: { paddingHorizontal: 16, paddingVertical: 8, borderRadius: 6 },
  formCancelText: { color: '#6b7280', fontWeight: '600' },
  formSubmitButton: { paddingHorizontal: 16, paddingVertical: 8, borderRadius: 6, backgroundColor: '#2563eb' },
  formSubmitText: { color: '#fff', fontWeight: '600' },
  buttonDisabled: { opacity: 0.5 },
  entityItem: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', padding: 16, borderBottomWidth: 1, borderBottomColor: '#f3f4f6' },
  entityInfo: { flex: 1 },
  entityName: { fontSize: 16, fontWeight: '600', color: '#111' },
  entitySlug: { fontSize: 13, color: '#6b7280', marginTop: 2 },
  roleBadge: { fontSize: 12, fontWeight: '600', color: '#2563eb', backgroundColor: '#eff6ff', paddingHorizontal: 8, paddingVertical: 4, borderRadius: 4, overflow: 'hidden', textTransform: 'capitalize' },
  empty: { padding: 40, alignItems: 'center' },
  emptyText: { fontSize: 14, color: '#9ca3af' },
  errorText: { fontSize: 14, color: '#ef4444', marginBottom: 12 },
  retryButton: { paddingHorizontal: 16, paddingVertical: 8, borderRadius: 6, backgroundColor: '#2563eb' },
  retryButtonText: { color: '#fff', fontWeight: '600' },
});
