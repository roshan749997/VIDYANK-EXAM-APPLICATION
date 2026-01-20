import React from 'react';
import { View, Text, StyleSheet, TouchableOpacity, Linking, useWindowDimensions, Image } from 'react-native';

const BLUE = '#282FFB';
const WHITE = '#fff';

const socialIcons = [
  { name: 'facebook', src: require('../../../assets/icons/Facebook svg.png'), url: 'https://facebook.com' },
  { name: 'instagram', src: require('../../../assets/icons/Instagram svg.png'), url: 'https://instagram.com' },
  { name: 'linkedin', src: require('../../../assets/icons/LinkedIn svg.png'), url: 'https://linkedin.com' },
  { name: 'whatsapp', src: require('../../../assets/icons/WhatsApp svg.png'), url: 'https://wa.me' },
];

const GlassFooter = () => {
  const { width } = useWindowDimensions();
  const isMobile = width < 700;

  return (
    <View style={[styles.footer, { flexDirection: isMobile ? 'column' : 'row', alignItems: isMobile ? 'flex-start' : 'center', height: isMobile ? 180 : 168 }]}>  
      <View style={[styles.left, { width: isMobile ? '100%' : '33%' }]}>  
        <View style={{ flexDirection: 'row', marginBottom: 12 }}>
          <FooterLink label="About Us" />
          <FooterLink label="Contact Us" />
          <FooterLink label="FAQ" />
        </View>
        <Text style={styles.copyright}>@Vidyank | 2025 All rights reserved.</Text>
      </View>
      <View style={[styles.right, { width: isMobile ? '100%' : '67%', alignItems: isMobile ? 'flex-start' : 'flex-end' }]}>  
        <View style={{ flexDirection: 'row', marginBottom: 12 }}>
          {socialIcons.map(icon => (
            <TouchableOpacity key={icon.name} onPress={() => Linking.openURL(icon.url)} style={{ marginHorizontal: 6 }}>
              <Image source={icon.src} style={{ width: 24, height: 24 }} />
            </TouchableOpacity>
          ))}
        </View>
        <View style={{ flexDirection: 'row' }}>
          <FooterLink label="Privacy Policy" />
          <FooterLink label="Terms" />
        </View>
      </View>
    </View>
  );
};

const FooterLink = ({ label }: { label: string }) => (
  <TouchableOpacity>
    <Text style={styles.link}>{label}</Text>
  </TouchableOpacity>
);

const styles = StyleSheet.create({
  footer: {
    width: '100%',
    backgroundColor: BLUE,
    paddingHorizontal: 32,
    paddingVertical: 18,
    justifyContent: 'space-between',
  },
  left: {
    justifyContent: 'flex-start',
    marginBottom: 8,
  },
  right: {
    justifyContent: 'flex-end',
  },
  link: {
    color: WHITE,
    fontSize: 15,
    marginRight: 18,
    fontWeight: '400',
  },
  copyright: {
    color: WHITE,
    fontSize: 14,
    marginTop: 8,
  },
});

export default GlassFooter;