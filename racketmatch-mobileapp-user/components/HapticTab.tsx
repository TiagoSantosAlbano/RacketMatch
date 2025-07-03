import React, { forwardRef } from 'react';
import { BottomTabBarButtonProps } from '@react-navigation/bottom-tabs';
import { Platform, Pressable } from 'react-native';
import * as Haptics from 'expo-haptics';

export const HapticTab = forwardRef<any, BottomTabBarButtonProps>((props, ref) => {
  return (
    <Pressable
      {...props}
      ref={ref}
      onPressIn={(ev) => {
        if (Platform.OS === 'ios') {
          Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
        }
        props.onPressIn?.(ev);
      }}
    />
  );
});
