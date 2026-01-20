import React from 'react';
import { TouchableOpacity, Text, StyleSheet, ActivityIndicator, ViewStyle, useWindowDimensions } from 'react-native';
import { colors } from '../theme';

interface GlassButtonProps {
  title: string;
  onPress: () => void;
  style?: ViewStyle;
  variant?: 'primary' | 'glass' | 'secondary';
  loading?: boolean;
  disabled?: boolean;
}

const GlassButton: React.FC<GlassButtonProps> = ({
  title,
  onPress,
  style,
  variant = 'glass',
  loading = false,
  disabled = false,
}) => {
  const { width: windowWidth } = useWindowDimensions();
  const isMobile = windowWidth < 480;

  return (
    <TouchableOpacity
      style={[
        styles.button,
        variant === 'primary'
          ? styles.solidPrimary
          : variant === 'secondary'
            ? styles.secondary
            : styles.glass,
        style,
        disabled && styles.disabled,
        isMobile && { paddingVertical: 8, paddingHorizontal: 14, minWidth: 60 }
      ]}
      onPress={onPress}
      activeOpacity={0.8}
      disabled={disabled || loading}
    >
      {loading ? (
        <ActivityIndicator color={variant === 'primary' ? '#fff' : colors.primary} />
      ) : (
        <Text style={[
          styles.text,
          variant === 'primary'
            ? styles.textSolid
            : variant === 'secondary'
              ? styles.textSecondary
              : styles.textPrimary,
          isMobile && { fontSize: 13 }
        ]}>{title}</Text>
      )}
    </TouchableOpacity>
  );
};

const styles = StyleSheet.create({
  button: {
    borderRadius: 12,
    paddingVertical: 14,
    paddingHorizontal: 24,
    alignItems: 'center',
    justifyContent: 'center',
    marginVertical: 6,
  },
  solidPrimary: {
    backgroundColor: colors.primary,
    borderColor: colors.primary,
  },
  glass: {
    backgroundColor: 'rgba(255,255,255,0.28)',
    borderColor: colors.border,
  },
  secondary: {
    backgroundColor: '#fff',
    borderColor: colors.primary,
  },
  disabled: {
    opacity: 0.5,
  },
  text: {
    fontWeight: 'bold',
    fontSize: 16,
  },
  textPrimary: {
    color: '#1f2937',
  },
  textSolid: {
    color: '#fff',
  },
  textSecondary: {
    color: colors.primary,
  },
});

export default GlassButton; 