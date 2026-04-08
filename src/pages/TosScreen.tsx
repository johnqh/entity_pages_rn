import React from 'react';
import { View, Text, ScrollView, TouchableOpacity } from 'react-native';
import { designTokens } from '@sudobility/design';

const { size, weight } = designTokens.typography;

export interface TosScreenProps {
  onAccept: () => void;
  onCancel: () => void;
  isLoading?: boolean;
}

export function TosScreen({ onAccept, onCancel, isLoading }: TosScreenProps) {
  return (
    <View className='flex-1 bg-white'>
      <ScrollView className='flex-1' contentContainerClassName='p-6 pb-10'>
        <Text
          className={[size['2xl'], weight.bold, 'mb-5 text-gray-900'].join(' ')}
        >
          Terms of Service
        </Text>
        <Text className={[size.sm, 'leading-[22px] text-gray-700'].join(' ')}>
          Welcome to Tapayoka. By using this application, you agree to the
          following terms and conditions.
        </Text>
        <Text
          className={[
            size.base,
            weight.semibold,
            'mt-5 mb-2 text-gray-900',
          ].join(' ')}
        >
          1. Acceptance of Terms
        </Text>
        <Text className={[size.sm, 'leading-[22px] text-gray-700'].join(' ')}>
          By accessing or using the Tapayoka vendor platform, you agree to be
          bound by these Terms of Service and all applicable laws and
          regulations.
        </Text>
        <Text
          className={[
            size.base,
            weight.semibold,
            'mt-5 mb-2 text-gray-900',
          ].join(' ')}
        >
          2. Use of Service
        </Text>
        <Text className={[size.sm, 'leading-[22px] text-gray-700'].join(' ')}>
          You agree to use the service only for lawful purposes and in
          accordance with these terms. You are responsible for maintaining the
          security of your account credentials.
        </Text>
        <Text
          className={[
            size.base,
            weight.semibold,
            'mt-5 mb-2 text-gray-900',
          ].join(' ')}
        >
          3. Vendor Responsibilities
        </Text>
        <Text className={[size.sm, 'leading-[22px] text-gray-700'].join(' ')}>
          As a vendor, you are responsible for the accuracy of your service
          listings, pricing, and device configurations. You agree to provide
          services as described and maintain your equipment in working order.
        </Text>
        <Text
          className={[
            size.base,
            weight.semibold,
            'mt-5 mb-2 text-gray-900',
          ].join(' ')}
        >
          4. Privacy
        </Text>
        <Text className={[size.sm, 'leading-[22px] text-gray-700'].join(' ')}>
          Your privacy is important to us. We collect and process data as
          described in our Privacy Policy, which is incorporated into these
          terms by reference.
        </Text>
        <Text
          className={[
            size.base,
            weight.semibold,
            'mt-5 mb-2 text-gray-900',
          ].join(' ')}
        >
          5. Limitation of Liability
        </Text>
        <Text className={[size.sm, 'leading-[22px] text-gray-700'].join(' ')}>
          Tapayoka shall not be liable for any indirect, incidental, special,
          consequential, or punitive damages resulting from your use of the
          service.
        </Text>
      </ScrollView>
      <View className='flex-row p-4 border-t border-neutral-200 gap-3'>
        <TouchableOpacity
          className='flex-1 py-3.5 rounded-lg border border-gray-300 items-center'
          onPress={onCancel}
          disabled={isLoading}
        >
          <Text
            className={[size.base, weight.semibold, 'text-gray-500'].join(' ')}
          >
            Cancel
          </Text>
        </TouchableOpacity>
        <TouchableOpacity
          className={[
            'flex-1 py-3.5 rounded-lg bg-blue-600 items-center',
            isLoading ? 'opacity-50' : '',
          ]
            .filter(Boolean)
            .join(' ')}
          onPress={onAccept}
          disabled={isLoading}
        >
          <Text
            className={[size.base, weight.semibold, 'text-white'].join(' ')}
          >
            {isLoading ? 'Please wait...' : 'Accept & Continue'}
          </Text>
        </TouchableOpacity>
      </View>
    </View>
  );
}
