import React from 'react';
import { View, Text, StyleSheet, Image, useWindowDimensions } from 'react-native';

const features = [
  {
    img: require('../../assets/icons/IJourney1.png'),
    title: 'Comprehensive Content',
    desc: 'All Subjects and topics covered in detail',
  },
  {
    img: require('../../assets/icons/IJorney3.png'),
    title: 'Comprehensive Content',
    desc: 'All Subjects and topics covered in detail',
  },
  {
    img: require('../../assets/icons/IJorney4.png'),
    title: 'Comprehensive Content',
    desc: 'All Subjects and topics covered in detail',
  },
  {
    img: require('../../assets/icons/Ijourney2.png'),
    title: 'Comprehensive Content',
    desc: 'All Subjects and topics covered in detail',
  },
];

const FeaturesSection = () => {
  const { width } = useWindowDimensions();
  const isMobile = width < 600;
  const isTablet = width >= 600 && width < 1000;
  const isDesktop = width >= 1000;

  // Responsive: decide how many cards per row
  let rowStyle = styles.row;
  let cardWrapStyle = {};
  if (isMobile) {
    rowStyle = { ...styles.row, flexDirection: 'column', width: '100%', alignItems: 'center', height: 'auto' } as any;
    cardWrapStyle = { marginHorizontal: 0, marginBottom: 28 };
  } else if (isTablet) {
    rowStyle = { ...styles.row, flexWrap: 'wrap', justifyContent: 'center', width: '100%', height: 'auto' } as any;
    cardWrapStyle = { marginHorizontal: 18, marginBottom: 28 };
  } else {
    rowStyle = styles.row;
    cardWrapStyle = { marginHorizontal: 28 };
  }

  return (
    <View style={[
      styles.section,
      (isMobile || isTablet) && { paddingHorizontal: 8, paddingVertical: 24, height: 'auto' },
    ]}>
      <View style={rowStyle}>
        {features.map((feature, idx) => (
          <View
            key={idx}
            style={[
              styles.card,
              cardWrapStyle,
              // Remove bottom margin for last card on mobile/tablet
              (isMobile || isTablet) && idx === features.length - 1 ? { marginBottom: 0 } : {},
            ]}
          >
            <Image
              source={feature.img}
              style={styles.image}
              resizeMode="contain"
            />
            <Text style={styles.title}>{feature.title}</Text>
            <Text style={styles.desc}>{feature.desc}</Text>
          </View>
        ))}
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  section: {
    width: '100%',
    maxWidth: 1440,
    height: 562,
    paddingVertical: 64,
    paddingHorizontal: 28, // Match card gap for left/right margin
    backgroundColor: 'transparent',
    justifyContent: 'center',
    alignItems: 'center',
    alignSelf: 'center', // Center the section itself
  },
  row: {
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
    width: 'auto', // Only as wide as needed for the cards
    height: '100%',
  },
  card: {
    width: 318.25,
    height: 434,
    borderRadius: 16,
    padding: 36, // Increased from 24 to 36
    backgroundColor: '#282FFB40',
    // boxShadow: '0px 0.1px 0.1px 0px #007C91', // React Native doesn't support boxShadow on all platforms
    alignItems: 'center',
    justifyContent: 'flex-start',
    marginHorizontal: 28, // Increased gap between cards
  },
  image: {
    width: 270.25,
    height: 240,
    borderRadius: 8,
    marginBottom: 24,
    backgroundColor: '#fff',
  },
  title: {
    fontSize: 22,
    fontWeight: '700',
    color: '#111',
    marginBottom: 8,
    fontFamily: 'Roboto',
  },
  desc: {
    fontSize: 16,
    color: '#222',
    fontFamily: 'Roboto',
  },
});

export default FeaturesSection;
