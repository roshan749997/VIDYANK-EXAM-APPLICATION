import React from 'react';
import { View, Text, StyleSheet, Image, TouchableOpacity, useWindowDimensions, ScrollView } from 'react-native';
import AdminLayout from './AdminLayout';

const settingsOptions = [
  { label: 'Monitor Your Exams', icon: require('../../assets/icons/ASetting1.png') },
  { label: 'Transfer Questions From Anywhere', icon: require('../../assets/icons/ASetting2.png') },
  { label: 'Certificate Maker', icon: require('../../assets/icons/ASetting3.png') },
  { label: 'Monitor Your Students', icon: require('../../assets/icons/ASetting4.png') },
  { label: 'Give your Feedback', icon: require('../../assets/icons/ASetting5.png') },
  { label: 'My Account', icon: require('../../assets/icons/ASetting6.png') },
  { label: 'Certificate Authentication', icon: require('../../assets/icons/ASetting7.png') },
];

const AdminSettings = () => {
  const { width } = useWindowDimensions();
  const isMobile = width < 900;
  const isDesktop = width >= 900;
  const cardGap = isMobile ? 16 : 32;
  const numColumns = isMobile ? 2 : 3;
  const cardHeight = isMobile ? 160 : 140;
  const cardPadding = isMobile ? 12 : 24;
  const cardFlexBasis = isMobile ? '48%' : '31%';
  const cardMinWidth = isMobile ? 140 : 260;
  const cardMaxWidth = isMobile ? 260 : 360;
  const iconSize = isMobile ? 56 : 48;
  const labelFont = isMobile ? 16 : 18;
  const cardMargin = isMobile ? 6 : 24;
  const gridPaddingHorizontal = isMobile ? 8 : 0;

  // Split cards into rows
  const rows = [];
  for (let i = 0; i < settingsOptions.length; i += numColumns) {
    rows.push(settingsOptions.slice(i, i + numColumns));
  }

  return (
    <AdminLayout title="Admin Settings">
      <ScrollView contentContainerStyle={styles.scrollContainer}>
        <View style={[styles.grid, { paddingHorizontal: gridPaddingHorizontal }] }>
          {rows.map((row, rowIdx) => (
            <View
              key={rowIdx}
              style={{
                flexDirection: 'row',
                justifyContent: 'center',
                marginBottom: rowIdx === rows.length - 1 ? 0 : cardGap,
                width: '100%',
              }}
            >
              {row.map((option, idx) => (
                <TouchableOpacity
                  key={option.label}
                  style={[
                    styles.card,
                    {
                      flexBasis: cardFlexBasis,
                      minWidth: cardMinWidth,
                      maxWidth: cardMaxWidth,
                      height: cardHeight,
                      padding: cardPadding,
                      marginLeft: cardMargin,
                      marginRight: cardMargin,
                      flexDirection: isMobile ? 'column' : 'row',
                      alignItems: 'center',
                      justifyContent: 'center',
                    },
                  ]}
                  activeOpacity={0.85}
                >
                  {isMobile ? (
                    <>
                      <Image source={option.icon} style={{ width: iconSize, height: iconSize, marginBottom: 10 }} resizeMode="contain" />
                      <Text style={{ fontSize: labelFont, fontWeight: '700', color: '#18181B', textAlign: 'center', flexShrink: 1 }}>
                        {option.label}
                      </Text>
                    </>
                  ) : (
                    <>
                      <Image source={option.icon} style={{ width: iconSize, height: iconSize, marginRight: 20 }} resizeMode="contain" />
                      <Text style={{ fontSize: labelFont, fontWeight: '700', color: '#18181B', textAlign: 'left', flexShrink: 1 }}>
                        {option.label}
                      </Text>
                    </>
                  )}
                </TouchableOpacity>
              ))}
            </View>
          ))}
        </View>
      </ScrollView>
    </AdminLayout>
  );
};

const styles = StyleSheet.create({
  scrollContainer: {
    flexGrow: 1,
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: 32,
    backgroundColor: '#fff',
  },
  grid: {
    width: '100%',
    maxWidth: 1100,
    flexDirection: 'row',
    flexWrap: 'wrap',
    justifyContent: 'center',
    alignItems: 'flex-start',
  },
  card: {
    backgroundColor: '#FAF9F7',
    borderRadius: 18,
    borderWidth: 2,
    borderColor: '#282FFB',
    shadowColor: '#000',
    shadowOpacity: 0.06,
    shadowRadius: 8,
    elevation: 2,
    overflow: 'hidden',
  },
});

export default AdminSettings;
