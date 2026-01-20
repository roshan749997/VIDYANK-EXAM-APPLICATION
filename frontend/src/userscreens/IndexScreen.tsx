import React from 'react';
import { View, Image, TouchableOpacity, Text, ScrollView, useWindowDimensions } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useNavigation } from '@react-navigation/native';
import type { NativeStackNavigationProp } from '@react-navigation/native-stack';
import type { RootStackParamList } from '../../App';
import ExamCategories from './ExamCategories';
import WhyChooseVidyank from './WhyChooseVidyank';
import TestimonialsSection from './TestimonialsSection';
import FeaturesSection from './FeaturesSection';
import VidyankAppDownload from './VidyankAppDownload';
import IndexFooter from './IndexFooter';
import HeroSection from './HeroSection';
import StatisticsSection from './StatisticsSection';

const HEADER_BG = '#282FFB1A';
const BLUE = '#282FFB';
const RED = '#E0115E';
const WHITE = '#fff';

const Header = () => {
  const { width } = useWindowDimensions();
  const isMobile = width < 600;
  const navigation = useNavigation<NativeStackNavigationProp<RootStackParamList>>();

  return (
    <View style={{
      width: '100%',
      flexDirection: 'row',
      alignItems: 'center',
      justifyContent: 'space-between',
      backgroundColor: HEADER_BG,
      paddingVertical: isMobile ? 8 : 10, // Reduced from 10:12 to 8:10
      paddingHorizontal: isMobile ? 12 : 40,
      height: isMobile ? 60 : 83.5, // Set specific height to match screenshot
    }}>
      {/* Logo */}
      <Image source={require('../../assets/header-logo.png')}
        style={{
          width: isMobile ? 80 : 120,
          height: isMobile ? 32 : 48,
          resizeMode: 'contain',
        }}
      />
      {/* Buttons */}
      <View style={{ flexDirection: 'row', alignItems: 'center' }}>
        <TouchableOpacity
          style={{
            backgroundColor: BLUE,
            borderRadius: 28,
            paddingHorizontal: isMobile ? 18 : 28,
            paddingVertical: isMobile ? 6 : 8, // Reduced from 8:12 to 6:8
            marginRight: 12,
          }}
          onPress={() => navigation.navigate('SignIn')}
        >
          <Text style={{
            color: WHITE,
            fontSize: isMobile ? 16 : 20,
            fontFamily: 'Roboto',
            fontWeight: '500',
          }}>Student Login</Text>
        </TouchableOpacity>
        <TouchableOpacity
          style={{
            backgroundColor: RED,
            borderRadius: 28,
            paddingHorizontal: isMobile ? 18 : 24,
            paddingVertical: isMobile ? 6 : 8, // Reduced from 8:12 to 6:8
          }}
          onPress={() => navigation.navigate('AdminLogin')}
        >
          <Text style={{
            color: WHITE,
            fontSize: isMobile ? 16 : 20,
            fontFamily: 'Roboto',
            fontWeight: '500',
          }}>Admin</Text>
        </TouchableOpacity>
      </View>
    </View>
  );
};

const IndexScreen = () => (
  <SafeAreaView style={{ flex: 1, backgroundColor: '#fff' }}>
      <Header />
    <ScrollView contentContainerStyle={{ flexGrow: 1 }} showsVerticalScrollIndicator={false} showsHorizontalScrollIndicator={false}>
      <HeroSection />
      <ExamCategories />
      <WhyChooseVidyank />
      <FeaturesSection />
      <StatisticsSection />
      <VidyankAppDownload />
      <TestimonialsSection />
      <View style={{ height: 32, backgroundColor: '#fff' }} />
      <IndexFooter />
    </ScrollView>
  </SafeAreaView>
);

export default IndexScreen;
