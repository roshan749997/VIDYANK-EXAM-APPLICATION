import React from 'react';
import { View, Text, Image, StyleSheet, useWindowDimensions, TouchableOpacity } from 'react-native';

const WhyChooseVidyank = () => {
  const { width } = useWindowDimensions();
  const isMobile = width < 800;
  const isTablet = width >= 800 && width < 1200;
  const isDesktop = width >= 1200;

  // Responsive paddings
  const horizontalPadding = isDesktop ? 64 : 24;
  const verticalPadding = isDesktop ? 64 : 32;

  let imageWidth = isMobile ? 380 : isTablet ? 520 : 1600; // Desktop साठी अजून मोठं
  let imageHeight = isMobile ? 480 : isTablet ? 650 : 1800; // Desktop साठी अजून मोठं
  let textContentWidth: number | string = isMobile ? '100%' : 798;
  let featuresRowWidth: number | string = isMobile ? '100%' : 798;
  if (isTablet) {
    imageWidth = 360;
    imageHeight = 456;
  } else if (isDesktop) {
    imageWidth = 380.53;
    imageHeight = 482;
  }

  return (
    <View style={{
      flexDirection: isMobile ? 'column' : 'row',
      paddingHorizontal: horizontalPadding,
      paddingVertical: verticalPadding,
      backgroundColor: '#fff',
      width: '100%',
      alignItems: 'center',
      justifyContent: 'center',
    }}>
      {/* Left: Image */}
      <View style={{
        alignItems: isDesktop ? 'center' : 'center',
        justifyContent: 'center',
        flex: isMobile ? undefined : 1,
        width: isDesktop ? '100%' : undefined, // Desktop साठी पूर्ण width
        marginRight: isDesktop ? 0 : isTablet ? 8 : 0, // No gap for desktop
        marginBottom: isMobile ? 6 : 0,
      }}>
        <Image
          source={require('../../assets/Group 1000015542.png')}
          style={{ width: isDesktop ? '100%' : imageWidth, height: imageHeight, resizeMode: 'contain' }}
        />
      </View>
      {/* Right: Text and Features */}
      <View style={{
        flex: isMobile ? undefined : 2,
        alignItems: isMobile ? 'center' : 'flex-start',
        width: isMobile ? '100%' : 798,
      }}>
        <Text style={{
          fontSize: isDesktop ? 40 : isTablet ? 32 : 26,
          fontWeight: 'bold',
          color: '#111',
          marginBottom: 16, // Gap reduced between heading and paragraph
          textAlign: isMobile ? 'center' : 'left',
        }}>
          Why Choose Vidyank ?
        </Text>
        <Text style={{
          fontSize: isDesktop ? 20 : isTablet ? 17 : 15,
          color: '#222',
          lineHeight: isDesktop ? 32 : isTablet ? 28 : 22,
          marginBottom: 32,
          textAlign: isMobile ? 'center' : 'left',
          maxWidth: 1050, // Further increased max width for longer lines
        }}>
          At Vidyank, we don’t just help you study — we help you succeed. Our platform is designed to empower students preparing for competitive exams like JEE, NEET, UPSC, MHT-CET, and FMGE with cutting-edge technology and expert support. With AI-driven learning tools, personalized test series, detailed performance analytics, and guidance from top educators, you get everything you need in one place. Whether you're aiming for top ranks or just want to build strong fundamentals, Vidyank gives you the clarity, confidence, and consistency to reach your goals. Join thousands of aspirants who trust Vidyank for a smarter, more efficient way to prepare.
        </Text>
        <View
          style={{
            flexDirection: isMobile ? 'column' : isTablet ? 'row' : 'row',
            flexWrap: isTablet ? 'wrap' : 'nowrap',
            width: isMobile ? '100%' : isTablet ? 650 : 970,
            alignSelf: 'center',
            justifyContent: 'center',
            marginTop: 0,
          }}
        >
          <TouchableOpacity
            activeOpacity={0.85}
            onPress={() => console.log('Pressed Test Series')}
            style={{
              backgroundColor: '#E0115E',
              borderRadius: 12,
              width: isMobile ? '100%' : isTablet ? 300 : 304,
              marginRight: isMobile ? 0 : 16,
              marginBottom: isMobile ? 8 : isTablet ? 16 : 0,
              height: 101,
              alignSelf: 'stretch',
              alignItems: 'center',
              justifyContent: 'center',
            }}
          >
            <Text style={{ color: '#fff', fontWeight: 'bold', fontSize: 28, marginBottom: 4, textAlign: 'center' }}>100+</Text>
            <Text style={{ color: '#fff', fontWeight: 'bold', fontSize: 18, textAlign: 'center' }}>Test Series</Text>
          </TouchableOpacity>
          <TouchableOpacity
            activeOpacity={0.85}
            onPress={() => console.log('Pressed Practice Questions')}
            style={{
              backgroundColor: '#282FFB',
              borderRadius: 12,
              width: isMobile ? '100%' : isTablet ? 300 : 304,
              marginRight: isMobile ? 0 : 16,
              marginBottom: isMobile ? 8 : isTablet ? 16 : 0,
              height: 101,
              alignSelf: 'stretch',
              alignItems: 'center',
              justifyContent: 'center',
            }}
          >
            <Text style={{ color: '#fff', fontWeight: 'bold', fontSize: 28, marginBottom: 4, textAlign: 'center' }}>10,000+</Text>
            <Text style={{ color: '#fff', fontWeight: 'bold', fontSize: 18, textAlign: 'center' }}>Practice Questions</Text>
          </TouchableOpacity>
          <TouchableOpacity
            activeOpacity={0.85}
            onPress={() => console.log('Pressed Doubt Support')}
            style={{
              backgroundColor: '#E0115E',
              borderRadius: 12,
              width: isMobile ? '100%' : isTablet ? 300 : 304,
              marginRight: 0,
              marginBottom: isMobile ? 8 : isTablet ? 16 : 0,
              height: 101,
              alignSelf: 'stretch',
              alignItems: 'center',
              justifyContent: 'center',
            }}
          >
            <Text style={{ color: '#fff', fontWeight: 'bold', fontSize: 28, marginBottom: 4, textAlign: 'center' }}>24×7</Text>
            <Text style={{ color: '#fff', fontWeight: 'bold', fontSize: 18, textAlign: 'center' }}>Doubt Support</Text>
          </TouchableOpacity>
        </View>
      </View>
    </View>
  );
};

export default WhyChooseVidyank; 