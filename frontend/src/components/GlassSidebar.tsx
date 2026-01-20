import React from 'react';
import { View, Text, TouchableOpacity, StyleSheet, Image, ScrollView, useWindowDimensions } from 'react-native';
import { Ionicons, MaterialCommunityIcons, FontAwesome5 } from '@expo/vector-icons';

interface SidebarItem {
  label: string;
  icon: React.ReactNode;
  onPress: () => void;
  active?: boolean;
}

interface GlassSidebarProps {
  items: SidebarItem[];
  collapsed: boolean;
  onClose: () => void;
  style?: any;
  admin?: boolean;
}

const GlassSidebar: React.FC<GlassSidebarProps> = ({ items, collapsed, onClose, style, admin }) => {
  const { width: windowWidth } = useWindowDimensions();
  if (collapsed) return null;
  // On mobile, use fixed width
  const sidebarWidth = windowWidth < 480 ? 220 : 260;
  return (
    <View style={[styles.sidebar, { width: sidebarWidth }, style]}>
      {/* Menu Items with ScrollView */}
      <ScrollView style={styles.menuList} showsVerticalScrollIndicator={false}>
        {items.map((item, idx) => (
          <TouchableOpacity
            key={item.label + idx}
            style={[
              styles.menuItem,
              item.active && styles.menuItemActive,
              admin && item.active && styles.menuItemActiveAdminBorder,
            ]}
            onPress={item.onPress}
            activeOpacity={0.8}
          >
            {React.isValidElement(item.icon) && (
              <View style={styles.iconBox}>{item.icon}</View>
            )}
            <Text style={[styles.menuText, item.active && styles.menuTextActive]}>{item.label}</Text>
          </TouchableOpacity>
        ))}
      </ScrollView>
    </View>
  );
};

const styles = StyleSheet.create({
  sidebar: {
    width: 260,
    backgroundColor: '#282FFB40', // Updated to new color
    paddingTop: 32,
    paddingHorizontal: 0,
    height: '100%',
    borderTopLeftRadius: 0,
    borderBottomLeftRadius: 0,
    borderRightWidth: 1,
    borderRightColor: '#e0e0e0',
    alignItems: 'stretch',
    justifyContent: 'flex-start',
  },
  logoRow: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 24,
    marginBottom: 40,
  },
  logoText: {
    fontSize: 20,
    fontWeight: 'bold',
    color: '#2d2d6a',
    letterSpacing: 1.2,
  },
  menuList: {
    flex: 1,
    paddingHorizontal: 0,
  },
  menuItem: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: 14,
    paddingLeft: 32,
    paddingRight: 12,
    borderRadius: 8,
    marginBottom: 6,
    marginRight: 12,
  },
  menuItemActive: {
    backgroundColor: '#2563eb',
  },
  iconBox: {
    width: 22,
    alignItems: 'center',
    marginRight: 16,
  },
  menuText: {
    fontSize: 17,
    color: '#222',
    fontWeight: '500',
    letterSpacing: 0.2,
  },
  menuTextActive: {
    color: '#fff',
    fontWeight: '700',
    fontSize: 17,
  },
  menuItemActiveAdminBorder: {
    borderLeftWidth: 4,
    borderLeftColor: '#2563eb',
    borderTopLeftRadius: 0,
    borderBottomLeftRadius: 0,
  },
});

export default GlassSidebar; 