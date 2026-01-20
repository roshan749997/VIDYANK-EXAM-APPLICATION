import React from 'react';
import { View, Text, StyleSheet, TouchableOpacity, Linking, useWindowDimensions, Image } from 'react-native';

const BLUE = '#282FFB';
const WHITE = '#fff';

const socialIcons = [
  { name: 'facebook', src: require('../../assets/icons/Facebook svg.png'), url: 'https://facebook.com' },
  { name: 'instagram', src: require('../../assets/icons/Instagram svg.png'), url: 'https://instagram.com' },
  { name: 'linkedin', src: require('../../assets/icons/LinkedIn svg.png'), url: 'https://linkedin.com' },
  { name: 'whatsapp', src: require('../../assets/icons/WhatsApp svg.png'), url: 'https://wa.me' },
];

const IndexFooter = () => {
  const { width } = useWindowDimensions();
  
  // Define breakpoints for responsive design
  const isMobile = width <= 480;
  const isTablet = width > 480 && width <= 768;
  const isDesktop = width > 768 && width <= 1200;
  const isLargeDesktop = width > 1200;

  const localStyles = StyleSheet.create({
    footer: {
      width: '100%',
      backgroundColor: BLUE,
      paddingHorizontal: isMobile ? 20 : isTablet ? 24 : isDesktop ? 32 : 40,
      paddingVertical: isMobile ? 24 : isTablet ? 24 : isDesktop ? 28 : 32,
      justifyContent: 'space-between',
    },
    footerContent: {
      flexDirection: isMobile ? 'column' : 'row',
      alignItems: isMobile ? 'stretch' : 'center',
      justifyContent: 'space-between',
      width: '100%',
    },
    left: {
      justifyContent: 'flex-start',
      marginBottom: isMobile ? 20 : 0,
      width: isMobile ? '100%' : isTablet ? '45%' : '50%',
    },
    right: {
      justifyContent: 'flex-end',
      alignItems: isMobile ? 'stretch' : 'flex-end',
      width: isMobile ? '100%' : isTablet ? '55%' : '50%',
    },
    navigationLinks: {
      flexDirection: isMobile ? 'column' : 'row',
      marginBottom: isMobile ? 16 : isTablet ? 10 : isDesktop || isLargeDesktop ? 24 : 8, // More gap for desktop/large desktop
      flexWrap: 'wrap',
    },
    socialIconsContainer: {
      flexDirection: 'row',
      marginBottom: isMobile ? 16 : isTablet ? 10 : isDesktop || isLargeDesktop ? 24 : 8, // More gap for desktop/large desktop
      justifyContent: isMobile ? 'flex-start' : 'flex-end',
      alignItems: 'center',
    },
    policyLinks: {
      flexDirection: 'row',
      justifyContent: isMobile ? 'flex-start' : 'flex-end',
      flexWrap: 'wrap',
    },
    link: {
      color: WHITE,
      fontSize: isMobile ? 16 : isTablet ? 15 : isDesktop ? 16 : 17,
      marginRight: isMobile ? 0 : isTablet ? 16 : isDesktop ? 20 : 24,
      marginBottom: isMobile ? 12 : 0,
      fontWeight: '400',
      fontFamily: 'Roboto',
      lineHeight: isMobile ? 20 : 18,
    },
    copyright: {
      color: WHITE,
      fontSize: isMobile ? 14 : isTablet ? 13 : isDesktop ? 14 : 15,
      marginTop: isMobile ? 12 : isTablet ? 6 : 4,
      fontWeight: '400',
      fontFamily: 'Roboto',
      lineHeight: isMobile ? 18 : 16,
    },
    socialIcon: {
      width: isMobile ? 28 : isTablet ? 22 : isDesktop ? 24 : 26,
      height: isMobile ? 28 : isTablet ? 22 : isDesktop ? 24 : 26,
      marginHorizontal: isMobile ? 8 : isTablet ? 5 : 6,
      resizeMode: 'contain',
    },
  });

  return (
    <View style={localStyles.footer}>
      {isMobile ? (
        <View style={{ flexDirection: 'row', width: '100%' }}>
          {/* Left column */}
          <View style={{ flex: 1, justifyContent: 'flex-start' }}>
            <View style={{ marginBottom: 16 }}>
              <FooterLink label="About Us" style={localStyles.link} />
              <FooterLink label="Contact Us" style={localStyles.link} />
              <FooterLink label="FAQ" style={localStyles.link} />
            </View>
            {/* Copyright and social icons in a single row */}
            <View style={{ flexDirection: 'row', alignItems: 'center', marginTop: 8 }}>
              <Text style={localStyles.copyright}>@Vidyank | 2025 All rights reserved.</Text>
              <View style={{ flexDirection: 'row', marginLeft: 8 }}>
                {socialIcons.map(icon => (
                  <TouchableOpacity 
                    key={icon.name} 
                    onPress={() => Linking.openURL(icon.url)} 
                    style={{ marginHorizontal: 0 }}
                  >
                    <Image source={icon.src} style={localStyles.socialIcon} />
                  </TouchableOpacity>
                ))}
              </View>
            </View>
          </View>
          {/* Right column */}
          <View style={{ flex: 1, alignItems: 'flex-end', justifyContent: 'space-between' }}>
            <View style={{ marginBottom: 16 }}>
              <FooterLink label="Privacy Policy" style={localStyles.link} />
              <FooterLink label="Terms" style={localStyles.link} />
            </View>
          </View>
        </View>
      ) : (
        <View style={localStyles.footerContent}>
          <View style={localStyles.left}>
            <View style={localStyles.navigationLinks}>
              <FooterLink label="About Us" style={localStyles.link} />
              <FooterLink label="Contact Us" style={localStyles.link} />
              <FooterLink label="FAQ" style={localStyles.link} />
            </View>
            <Text style={localStyles.copyright}>@Vidyank | 2025 All rights reserved.</Text>
      </View>
          <View style={localStyles.right}>
            <View style={localStyles.socialIconsContainer}>
          {socialIcons.map(icon => (
                <TouchableOpacity 
                  key={icon.name} 
                  onPress={() => Linking.openURL(icon.url)} 
                  style={{ marginHorizontal: isTablet ? 5 : 6 }}
                >
                  <Image source={icon.src} style={localStyles.socialIcon} />
            </TouchableOpacity>
          ))}
        </View>
            <View style={localStyles.policyLinks}>
              <FooterLink label="Privacy Policy" style={localStyles.link} />
              <FooterLink label="Terms" style={localStyles.link} />
            </View>
          </View>
        </View>
      )}
    </View>
  );
};

const FooterLink = ({ label, style }: { label: string; style: any }) => (
  <TouchableOpacity>
    <Text style={style}>{label}</Text>
  </TouchableOpacity>
);

export default IndexFooter;