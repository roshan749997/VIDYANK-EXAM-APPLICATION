import React from 'react';
import { View } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';

const BlankHeader: React.FC = () => {
  const insets = useSafeAreaInsets();
  // Clamp the top inset to a reasonable max (44 for iPhone X notch, min 16 for most devices)
  const top = Math.max(Math.min(insets.top, 44), 16);
  return <View style={{ height: top, backgroundColor: 'transparent' }} />;
};

export default BlankHeader; 