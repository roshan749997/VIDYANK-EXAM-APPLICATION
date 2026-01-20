import React from 'react';
import { View, Text, StyleSheet, Image, TouchableOpacity, useWindowDimensions } from 'react-native';

const featureCards = [
  {
    icon: require('../../assets/icons/Asettingicon3.png'),
    label: 'Monitor Your Exams',
  },
  {
    icon: require('../../assets/icons/Asettingicon1.png'),
    label: 'Transfer Questions From Anywhere',
  },
  {
    icon: require('../../assets/icons/Asettingicon2.png'),
    label: 'Certificate Maker',
  },
];

const AdminFeatureCards = () => {
  const { width } = useWindowDimensions();
  const isMobile = width < 800;
  const isDesktop = width >= 1200;
  const cardGap = isMobile ? 16 : 24;
  const iconSize = isMobile ? 56 : 48;
  const labelFont = isMobile ? 15 : 17;

  // For mobile/tablet, 2 columns; for desktop, all in a row
  const numColumns = isMobile ? 2 : featureCards.length;
  // Split cards into rows for mobile/tablet
  const rows = [];
  for (let i = 0; i < featureCards.length; i += numColumns) {
    rows.push(featureCards.slice(i, i + numColumns));
  }

  return (
    <View style={{ width: '100%', alignItems: 'center' }}>
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
          {row.map((card, idx) => (
            <TouchableOpacity
              key={idx}
              style={[
                styles.card,
                {
                  flexDirection: isDesktop ? 'row' : 'column',
                  alignItems: isDesktop ? 'center' : 'center',
                  justifyContent: isDesktop ? 'flex-start' : 'center',
                  width: isDesktop ? 375 : isMobile ? '48%' : 320,
                  height: isMobile ? 140 : 120,
                  marginHorizontal: isMobile ? 4 : 12,
                  padding: isMobile ? 12 : 20,
                  backgroundColor: '#FAF9F7',
                },
              ]}
              activeOpacity={0.8}
              onPress={() => console.log(`${card.label} pressed`)}
            >
              <Image
                source={card.icon}
                style={{
                  width: iconSize,
                  height: iconSize,
                  marginBottom: isDesktop ? 0 : 10,
                  marginRight: isDesktop ? 18 : 0,
                }}
                resizeMode="contain"
              />
              <Text
                style={{
                  fontSize: labelFont,
                  fontWeight: '600',
                  color: '#222',
                  textAlign: isDesktop ? 'left' : 'center',
                  flexShrink: 1,
                }}
              >
                {card.label}
              </Text>
            </TouchableOpacity>
          ))}
        </View>
      ))}
    </View>
  );
};

const styles = StyleSheet.create({
  card: {
    backgroundColor: '#FAF9F7',
    borderWidth: 1,
    borderColor: '#4f46e5',
    borderRadius: 12, // rounded corners restored
    shadowColor: '#4f46e5',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.07,
    shadowRadius: 8,
    elevation: 2,
    marginBottom: 0,
  },
});

export default AdminFeatureCards; 