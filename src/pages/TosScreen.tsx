import React from 'react';
import {
  View,
  Text,
  ScrollView,
  TouchableOpacity,
  StyleSheet,
} from 'react-native';

export interface TosScreenProps {
  onAccept: () => void;
  onCancel: () => void;
  isLoading?: boolean;
}

export function TosScreen({ onAccept, onCancel, isLoading }: TosScreenProps) {
  return (
    <View style={styles.container}>
      <ScrollView style={styles.scroll} contentContainerStyle={styles.scrollContent}>
        <Text style={styles.title}>Terms of Service</Text>
        <Text style={styles.body}>
          Welcome to Tapayoka. By using this application, you agree to the
          following terms and conditions.
        </Text>
        <Text style={styles.sectionTitle}>1. Acceptance of Terms</Text>
        <Text style={styles.body}>
          By accessing or using the Tapayoka vendor platform, you agree to be
          bound by these Terms of Service and all applicable laws and
          regulations.
        </Text>
        <Text style={styles.sectionTitle}>2. Use of Service</Text>
        <Text style={styles.body}>
          You agree to use the service only for lawful purposes and in
          accordance with these terms. You are responsible for maintaining the
          security of your account credentials.
        </Text>
        <Text style={styles.sectionTitle}>3. Vendor Responsibilities</Text>
        <Text style={styles.body}>
          As a vendor, you are responsible for the accuracy of your service
          listings, pricing, and device configurations. You agree to provide
          services as described and maintain your equipment in working order.
        </Text>
        <Text style={styles.sectionTitle}>4. Privacy</Text>
        <Text style={styles.body}>
          Your privacy is important to us. We collect and process data as
          described in our Privacy Policy, which is incorporated into these
          terms by reference.
        </Text>
        <Text style={styles.sectionTitle}>5. Limitation of Liability</Text>
        <Text style={styles.body}>
          Tapayoka shall not be liable for any indirect, incidental, special,
          consequential, or punitive damages resulting from your use of the
          service.
        </Text>
      </ScrollView>
      <View style={styles.footer}>
        <TouchableOpacity
          style={styles.cancelButton}
          onPress={onCancel}
          disabled={isLoading}
        >
          <Text style={styles.cancelButtonText}>Cancel</Text>
        </TouchableOpacity>
        <TouchableOpacity
          style={[styles.acceptButton, isLoading && styles.buttonDisabled]}
          onPress={onAccept}
          disabled={isLoading}
        >
          <Text style={styles.acceptButtonText}>
            {isLoading ? 'Please wait...' : 'Accept & Continue'}
          </Text>
        </TouchableOpacity>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff',
  },
  scroll: {
    flex: 1,
  },
  scrollContent: {
    padding: 24,
    paddingBottom: 40,
  },
  title: {
    fontSize: 24,
    fontWeight: '700',
    marginBottom: 20,
    color: '#111',
  },
  sectionTitle: {
    fontSize: 16,
    fontWeight: '600',
    marginTop: 20,
    marginBottom: 8,
    color: '#111',
  },
  body: {
    fontSize: 14,
    lineHeight: 22,
    color: '#444',
  },
  footer: {
    flexDirection: 'row',
    padding: 16,
    borderTopWidth: 1,
    borderTopColor: '#e5e5e5',
    gap: 12,
  },
  cancelButton: {
    flex: 1,
    paddingVertical: 14,
    borderRadius: 8,
    borderWidth: 1,
    borderColor: '#d1d5db',
    alignItems: 'center',
  },
  cancelButtonText: {
    fontSize: 16,
    fontWeight: '600',
    color: '#6b7280',
  },
  acceptButton: {
    flex: 1,
    paddingVertical: 14,
    borderRadius: 8,
    backgroundColor: '#2563eb',
    alignItems: 'center',
  },
  acceptButtonText: {
    fontSize: 16,
    fontWeight: '600',
    color: '#fff',
  },
  buttonDisabled: {
    opacity: 0.5,
  },
});
