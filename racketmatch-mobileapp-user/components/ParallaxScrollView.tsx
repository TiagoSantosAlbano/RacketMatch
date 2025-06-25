import type { PropsWithChildren, ReactElement } from 'react';
import { StyleSheet } from 'react-native';
import Animated, {
  interpolate,
  useAnimatedRef,
  useAnimatedStyle,
  useScrollViewOffset,
  Extrapolate,
} from 'react-native-reanimated';

import { ThemedView } from './ThemedView';
import { useBottomTabOverflow } from './ui/TabBarBackground';
import { useColorScheme } from '../shared/hooks/useColorScheme';

const HEADER_HEIGHT = 250;

type Props = PropsWithChildren<{
  headerImage: ReactElement;
  headerBackgroundColor: { dark: string; light: string };
}>;

export default function ParallaxScrollView({
  children,
  headerImage,
  headerBackgroundColor,
}: Props) {
  const colorScheme = useColorScheme() ?? 'light';
  const scrollRef = useAnimatedRef<Animated.ScrollView>();
  const scrollOffset = useScrollViewOffset(scrollRef);
  const bottom = useBottomTabOverflow();

  const headerAnimatedStyle = useAnimatedStyle(() => {
    const translateY = interpolate(
      scrollOffset.value,
      [-HEADER_HEIGHT, 0, HEADER_HEIGHT],
      [-HEADER_HEIGHT / 2, 0, HEADER_HEIGHT * 0.75],
      Extrapolate.CLAMP
    );

    const scale = interpolate(
      scrollOffset.value,
      [-HEADER_HEIGHT, 0, HEADER_HEIGHT],
      [2, 1, 1],
      Extrapolate.CLAMP
    );

    return {
      transform: [{ translateY: translateY ?? 0 }, { scale: scale ?? 1 }],
    } as Animated.AnimateStyle<any>;
  });

  return (
    <ThemedView style={styles.container}>
      <Animated.ScrollView
        ref={scrollRef}
        scrollEventThrottle={16}
        scrollIndicatorInsets={{ bottom }}
        contentContainerStyle={{ paddingBottom: bottom }}>
        <Animated.View
          style={[
            styles.header,
            {
              backgroundColor:
                headerBackgroundColor[colorScheme as 'light' | 'dark'],
            },
            headerAnimatedStyle,
          ]}>
          {headerImage}
        </Animated.View>
        <ThemedView style={styles.content}>{children}</ThemedView>
      </Animated.ScrollView>
    </ThemedView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  header: {
    height: HEADER_HEIGHT,
    overflow: 'hidden',
  },
  content: {
    flex: 1,
    padding: 32,
    gap: 16,
    overflow: 'hidden',
  },
});
