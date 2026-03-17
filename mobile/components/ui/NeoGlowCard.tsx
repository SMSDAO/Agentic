import React from 'react';
import { View, StyleSheet, StyleProp, ViewStyle } from 'react-native';

interface NeoGlowCardProps {
  children: React.ReactNode;
  glowColor?: string;
  shadowColor?: string;
  style?: StyleProp<ViewStyle>;
}

/**
 * A card component with a Neo Glow border and glassmorphism background,
 * matching the web-app's `neo-card` Tailwind utility.
 */
export function NeoGlowCard({
  children,
  glowColor = '#00d4ff',
  shadowColor,
  style,
}: NeoGlowCardProps) {
  return (
    <View
      style={[
        styles.card,
        {
          borderColor: glowColor,
          shadowColor: shadowColor ?? glowColor,
        },
        style,
      ]}
    >
      {children}
    </View>
  );
}

const styles = StyleSheet.create({
  card: {
    backgroundColor: 'rgba(20, 20, 32, 0.85)',
    borderRadius: 16,
    borderWidth: 1,
    padding: 16,
    shadowOffset: { width: 0, height: 0 },
    shadowOpacity: 0.5,
    shadowRadius: 12,
    elevation: 8,
  },
});
