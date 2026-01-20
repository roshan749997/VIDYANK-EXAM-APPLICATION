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
  const isLargeDesktop = width >= 1400;

  // Responsive dimensions
  const containerPadding = isMobile ? 16 : isTablet ? 24 : isLargeDesktop ? 64 : 40;
  const cardGap = isMobile ? 16 : isTablet ? 20 : 24;
  const sectionPaddingVertical = isMobile ? 32 : isTablet ? 48 : 64;

  // Card dimensions
  const cardWidth = isMobile 
    ? width - (containerPadding * 2) 
    : isTablet 
    ? (width - (containerPadding * 2) - (cardGap * 3)) / 2
    : isLargeDesktop
    ? 318
    : (width - (containerPadding * 2) - (cardGap * 3)) / 4;
  
  const cardHeight = isMobile ? 380 : isTablet ? 400 : 434;
  const cardPadding = isMobile ? 20 : isTablet ? 28 : 36;

  // Image dimensions
  const imageWidth = isMobile ? cardWidth - (cardPadding * 2) : isTablet ? 220 : 270;
  const imageHeight = isMobile ? 180 : isTablet ? 200 : 240;

  // Font sizes
  const titleFontSize = isMobile ? 18 : isTablet ? 20 : 22;
  const descFontSize = isMobile ? 14 : isTablet ? 15 : 16;

  return (
    <View style={[
      styles.section,
      {
        paddingVertical: sectionPaddingVertical,
        paddingHorizontal: containerPadding,
        minHeight: isMobile ? 'auto' : 562,
      },
    ]}>
      <View style={[
        styles.row,
        {
          flexDirection: isMobile ? 'column' : 'row',
          flexWrap: isTablet ? 'wrap' : 'nowrap',
          justifyContent: 'center',
          alignItems: 'center',
          gap: cardGap,
        },
      ]}>
        {features.map((feature, idx) => (
          <View
            key={idx}
            style={[
              styles.card,
              {
                width: cardWidth,
                maxWidth: isMobile ? '100%' : cardWidth,
                height: cardHeight,
                padding: cardPadding,
                marginBottom: isMobile && idx < features.length - 1 ? cardGap : 0,
              },
            ]}
          >
            <Image
              source={feature.img}
              style={[
                styles.image,
                {
                  width: imageWidth,
                  height: imageHeight,
                  marginBottom: isMobile ? 16 : isTablet ? 20 : 24,
                },
              ]}
              resizeMode="contain"
            />
            <Text style={[styles.title, { fontSize: titleFontSize }]}>
              {feature.title}
            </Text>
            <Text style={[styles.desc, { fontSize: descFontSize }]}>
              {feature.desc}
            </Text>
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
    backgroundColor: 'transparent',
    justifyContent: 'center',
    alignItems: 'center',
    alignSelf: 'center',
  },
  row: {
    width: '100%',
    alignItems: 'center',
  },
  card: {
    borderRadius: 16,
    backgroundColor: '#282FFB40',
    alignItems: 'center',
    justifyContent: 'flex-start',
    shadowColor: '#000',
    shadowOpacity: 0.05,
    shadowRadius: 8,
    shadowOffset: { width: 0, height: 2 },
    elevation: 2,
  },
  image: {
    borderRadius: 8,
    backgroundColor: '#fff',
  },
  title: {
    fontWeight: '700',
    color: '#111',
    marginBottom: 8,
    fontFamily: 'Roboto',
    textAlign: 'center',
  },
  desc: {
    color: '#222',
    fontFamily: 'Roboto',
    textAlign: 'center',
    lineHeight: 22,
  },
});

export default FeaturesSection;
