import React from 'react';
import { View, Image, TouchableOpacity, Text, useWindowDimensions } from 'react-native';
import { useNavigation } from '@react-navigation/native';
import type { NativeStackNavigationProp } from '@react-navigation/native-stack';
import type { RootStackParamList } from '../../App';

const BLUE = '#282FFB';
const WHITE = '#fff';

const HeroSection = () => {
  const { width } = useWindowDimensions();
  const isMobile = width < 800;
  const navigation = useNavigation<NativeStackNavigationProp<RootStackParamList>>();

  const image = (
    <View style={{ flex: 1, alignItems: 'center', justifyContent: 'center', minWidth: isMobile ? 0 : 540, marginBottom: isMobile ? 20 : 0, marginTop: isMobile ? 0 : 0 }}>
      <Image source={require('../../assets/pic are circle.png')} style={{ width: isMobile ? 280 : 560, height: isMobile ? 233 : 467, resizeMode: 'contain' }} />
    </View>
  );

  const textContent = (
    <View style={{ flex: 1, maxWidth: isMobile ? '100%' : 1000, marginLeft: isMobile ? 0 : 70, justifyContent: 'center', alignItems: isMobile ? 'center' : 'flex-start', paddingHorizontal: isMobile ? 16 : 0 }}>
      <View style={{ width: '100%', maxWidth: isMobile ? '100%' : 700, alignItems: isMobile ? 'center' : 'flex-start' }}>
        <Text style={{ fontFamily: 'Roboto', fontWeight: '900', fontSize: isMobile ? 28 : 60, color: '#111', lineHeight: isMobile ? 32 : 68, marginBottom: isMobile ? 2 : 8, textAlign: isMobile ? 'center' : 'left', letterSpacing: -2 }}>
          Master Your Dreams
        </Text>
        <Text style={{ fontFamily: 'Roboto', fontWeight: '900', fontSize: isMobile ? 28 : 60, color: BLUE, lineHeight: isMobile ? 32 : 68, marginBottom: 0, textAlign: isMobile ? 'center' : 'left', letterSpacing: -2 }}>
          With Vidyank
        </Text>
      </View>
      <Text style={{ fontFamily: 'Roboto', fontWeight: '400', fontSize: isMobile ? 15 : 22, color: '#222', marginTop: isMobile ? 12 : 24, marginBottom: isMobile ? 16 : 28, textAlign: isMobile ? 'center' : 'left' }}>
        Transform your exam preparation with AI-powered learning, comprehensive test series, and expert guidance for JEE, NEET, MHT-CET & FMGE.
      </Text>
      <TouchableOpacity
        style={{ backgroundColor: BLUE, borderRadius: 32, paddingHorizontal: isMobile ? 20 : 36, paddingVertical: isMobile ? 10 : 18, alignSelf: isMobile ? 'center' : 'flex-start' }}
        onPress={() => navigation.navigate('Register')}
      >
        <Text style={{ color: WHITE, fontFamily: 'Roboto', fontWeight: '700', fontSize: isMobile ? 16 : 22 }}>Start Your Journey</Text>
      </TouchableOpacity>
    </View>
  );

  return (
    <View style={{
      flexDirection: isMobile ? 'column' : 'row',
      alignItems: 'center',
      justifyContent: 'center',
      width: '100%',
      backgroundColor: WHITE,
      paddingTop: isMobile ? 20 : 40,
      paddingBottom: isMobile ? 20 : 40,
      minHeight: isMobile ? 300 : 450,
    }}>
      {isMobile ? (
        <>
          {image}
          {textContent}
        </>
      ) : (
        <>
          {textContent}
          {image}
        </>
      )}
    </View>
  );
};

export default HeroSection;