
import { openBrowserAsync } from 'expo-web-browser';
import { type ComponentProps } from 'react';
import { Platform, Pressable, Text } from 'react-native';

type Props = {
  href: string;
  children: React.ReactNode;
  style?: ComponentProps<typeof Text>['style'];
};

export function ExternalLink({ href, children, style }: Props) {
  const handlePress = async (event: any) => {
    if (Platform.OS !== 'web') {
      event.preventDefault();
      await openBrowserAsync(href);
    }
  };

  return (
    <Pressable onPress={handlePress}>
      <Text style={[{ color: '#007aff' }, style]}>
        {children}
      </Text>
    </Pressable>
  );
}
