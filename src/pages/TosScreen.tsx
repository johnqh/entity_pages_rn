import React from 'react';
import { View, Text, ScrollView, TouchableOpacity } from 'react-native';

export interface TosScreenProps {
  onAccept: () => void;
  onCancel: () => void;
  isLoading?: boolean;
}

export function TosScreen({ onAccept, onCancel, isLoading }: TosScreenProps) {
  return (
    <View className='flex-1 bg-white'>
      <ScrollView className='flex-1' contentContainerClassName='p-6 pb-10'>
        <Text className='text-2xl font-bold mb-5 text-gray-900'>
          Terms of Service
        </Text>
        <Text className='text-sm leading-[22px] text-gray-700'>
          Welcome to Tapayoka. By using this application, you agree to the
          following terms and conditions.
        </Text>
        <Text className='text-base font-semibold mt-5 mb-2 text-gray-900'>
          1. Acceptance of Terms
        </Text>
        <Text className='text-sm leading-[22px] text-gray-700'>
          By accessing or using the Tapayoka vendor platform, you agree to be
          bound by these Terms of Service and all applicable laws and
          regulations.
        </Text>
        <Text className='text-base font-semibold mt-5 mb-2 text-gray-900'>
          2. Use of Service
        </Text>
        <Text className='text-sm leading-[22px] text-gray-700'>
          You agree to use the service only for lawful purposes and in
          accordance with these terms. You are responsible for maintaining the
          security of your account credentials.
        </Text>
        <Text className='text-base font-semibold mt-5 mb-2 text-gray-900'>
          3. Vendor Responsibilities
        </Text>
        <Text className='text-sm leading-[22px] text-gray-700'>
          As a vendor, you are responsible for the accuracy of your service
          listings, pricing, and device configurations. You agree to provide
          services as described and maintain your equipment in working order.
        </Text>
        <Text className='text-base font-semibold mt-5 mb-2 text-gray-900'>
          4. Privacy
        </Text>
        <Text className='text-sm leading-[22px] text-gray-700'>
          Your privacy is important to us. We collect and process data as
          described in our Privacy Policy, which is incorporated into these
          terms by reference.
        </Text>
        <Text className='text-base font-semibold mt-5 mb-2 text-gray-900'>
          5. Limitation of Liability
        </Text>
        <Text className='text-sm leading-[22px] text-gray-700'>
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
          <Text className='text-base font-semibold text-gray-500'>Cancel</Text>
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
          <Text className='text-base font-semibold text-white'>
            {isLoading ? 'Please wait...' : 'Accept & Continue'}
          </Text>
        </TouchableOpacity>
      </View>
    </View>
  );
}
