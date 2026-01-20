import React from 'react';
import { View, StyleSheet, ViewProps, Platform, useWindowDimensions } from 'react-native';

interface GlassCardProps extends ViewProps {
  children: React.ReactNode;
  style?: any;
}

const GlassCard: React.FC<GlassCardProps> = ({ children, style, ...rest }) => {
  const { width: windowWidth } = useWindowDimensions();
  const isMobile = windowWidth < 480;
  return (
    <View style={[
      styles.card,
      { padding: isMobile ? 10 : 16 },
      style,
      // Remove border removal overrides
    ]} {...rest}>
      <View style={styles.inner}>{children}</View>
    </View>
  );
};

const styles = StyleSheet.create({
  card: {
    borderRadius: 12,
    overflow: 'hidden',
    backgroundColor: '#fff',
    borderLeftWidth: 2,
    borderRightWidth: 2,
    borderColor: '#e5e7eb',
  },
  inner: {
    padding: 16,
  },
});

export default GlassCard; 