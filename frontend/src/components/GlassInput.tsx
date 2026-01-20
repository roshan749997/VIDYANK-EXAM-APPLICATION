import React, { ReactNode } from 'react';
import { View, TextInput, StyleSheet, Text, TextInputProps, useWindowDimensions } from 'react-native';
import { colors } from '../theme';

interface GlassInputProps extends TextInputProps {
  error?: string;
  icon?: ReactNode;
}

const GlassInput: React.FC<GlassInputProps> = ({ error, icon, style, ...props }) => {
  const { width: windowWidth } = useWindowDimensions();
  const isMobile = windowWidth < 480;

  return (
    <View style={styles.container}>
      <View style={styles.inputWrapper}>
        {icon && <View style={styles.icon}>{icon}</View>}
        <TextInput
          style={[
            style,
            error && styles.inputError,
            isMobile && { padding: 8, fontSize: 13 },
            icon ? { paddingLeft: 44 } : {},
            { borderWidth: 1, borderColor: '#e5e7eb', borderRadius: 12 },
          ]}
          placeholderTextColor={colors.textSecondary}
          {...props}
        />
      </View>
      {error ? <Text style={styles.errorText}>{error}</Text> : null}
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    width: '100%',
    marginBottom: 12,
  },
  inputWrapper: {
    flexDirection: 'row',
    alignItems: 'center',
    position: 'relative',
  },
  icon: {
    position: 'absolute',
    left: 12,
    zIndex: 2,
    width: 22,
    height: 22,
    top: '50%',
    transform: [{ translateY: -11 }],
    justifyContent: 'center',
    alignItems: 'center',
    opacity: 0.85,
  },
  input: {
    width: '100%',
    backgroundColor: '#fff',
    borderRadius: 10,
    padding: 14,
    color: colors.text,
    borderWidth: 1,
    borderColor: colors.border,
    fontSize: 16,
    paddingLeft: 14,
  },
  inputError: {
    borderColor: colors.accent,
  },
  errorText: {
    color: colors.accent,
    fontSize: 13,
    marginTop: 4,
    marginLeft: 4,
  },
});

export default GlassInput; 