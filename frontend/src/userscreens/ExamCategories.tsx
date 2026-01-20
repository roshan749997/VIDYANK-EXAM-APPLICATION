import React from 'react';
import { View, Text, StyleSheet, useWindowDimensions, TouchableOpacity, Image } from 'react-native';
import MedicalSquare from '../../assets/icons/medical-square.svg';
import Target from '../../assets/icons/target-04.svg';
import Trophy from '../../assets/icons/trophy-01.svg';
import BookOpen from '../../assets/icons/book-open-02.svg';
import PencilLine from '../../assets/icons/pencil-line.svg';

const CARD_DATA = [
  { icon: MedicalSquare, title: 'JEE', subtitle: 'Smart prep for JEE success.' },
  { icon: Target, title: 'MHT-CET', subtitle: 'Smart prep for JEE success.' },
  { icon: Trophy, title: 'UPSC', subtitle: 'Smart prep for JEE success.' },
  { icon: BookOpen, title: 'FMGE', subtitle: 'Smart prep for JEE success.' },
  { icon: PencilLine, title: 'JEE', subtitle: 'Smart prep for JEE success.' },
  { icon: MedicalSquare, title: 'JEE', subtitle: 'Smart prep for JEE success.' },
  { icon: PencilLine, title: 'JEE', subtitle: 'Smart prep for JEE success.' },
  { icon: MedicalSquare, title: 'JEE', subtitle: 'Smart prep for JEE success.' },
];

const ExamCategories = () => {
  const { width } = useWindowDimensions();
  const isMobile = width < 800;
  const isTablet = width >= 800 && width < 1200;
  const isDesktop = width >= 1200;

  // Responsive settings
  const cardGap = isMobile ? 16 : isTablet ? 24 : 32;
  const containerPadding = isMobile ? 16 : isTablet ? 32 : isDesktop ? 64 : 40;
  const numColumns = isMobile || isTablet ? 2 : 4;
  const cardHeight = isMobile ? 170 : isDesktop ? 150 : 150;
  const iconSize = isMobile ? 56 : 48;
  const titleFont = isMobile ? 18 : 22;
  const subtitleFont = isMobile ? 13 : 16;

  // Card width for grid gap logic (mobile/tablet)
  let cardWidthPercent: any = '48%';
  if (isTablet) cardWidthPercent = '48%';
  if (isDesktop) cardWidthPercent = undefined;

  // Split cards into rows based on numColumns
  const rows = [];
  for (let i = 0; i < CARD_DATA.length; i += numColumns) {
    rows.push(CARD_DATA.slice(i, i + numColumns));
  }

  return (
    <View style={[styles.container, { paddingVertical: isMobile ? 24 : 40, paddingHorizontal: containerPadding }] }>
      <Text style={[styles.heading, { fontSize: isMobile ? 24 : 36, marginBottom: isMobile ? 20 : 36 }]}>Begin Your Journey to Excellence</Text>
      <View style={styles.grid}>
        {rows.map((row, rowIdx) => (
          <View
            key={rowIdx}
            style={
              isDesktop
                ? [styles.row, { flexDirection: 'row', justifyContent: 'center', marginBottom: rowIdx === rows.length - 1 ? 0 : cardGap }]
                : { flexDirection: 'row', justifyContent: 'center' }
            }
          >
            {row.map((item, idx) => {
              const isLastColumn = idx === row.length - 1;
              const isLastRow = rowIdx === rows.length - 1;
              const Icon = item.icon;
              return (
                <TouchableOpacity
                  key={idx}
                  activeOpacity={0.85}
                  onPress={() => console.log('Pressed', item.title)}
                  style={[
                    styles.card,
                    isDesktop
                      ? {
                          width: 360, // Card width कमी केली
                          height: cardHeight,
                          alignItems: 'center',
                          justifyContent: 'center',
                          padding: 24,
                          marginLeft: 8, // Add left margin
                          marginRight: 8, // Add right margin
                          flexDirection: 'row',
                        }
                      : {
                          width: cardWidthPercent,
                          height: cardHeight,
                          alignItems: 'center',
                          justifyContent: 'center',
                          padding: isMobile ? 12 : 24,
                          marginLeft: 8, // Add left margin
                          marginRight: 8, // Add right margin
                          marginBottom: isLastRow ? 0 : cardGap,
                        },
                  ]}
                >
                  {isDesktop ? (
                    <>
                      <View style={{ justifyContent: 'center', alignItems: 'center', marginRight: 20 }}>
                        {React.createElement(item.icon, { width: iconSize, height: iconSize })}
                      </View>
                      <View style={{ justifyContent: 'center', alignItems: 'flex-start', flex: 1 }}>
                        <Text
                          style={{ fontSize: titleFont, fontWeight: '700', color: '#111', fontFamily: 'Roboto', textAlign: 'left', flexShrink: 1, marginBottom: 4 }}
                          numberOfLines={2}
                          ellipsizeMode="tail"
                        >
                          {item.title}
                        </Text>
                        <Text
                          style={{ fontSize: subtitleFont, color: '#222', fontFamily: 'Roboto', textAlign: 'left', flexShrink: 1 }}
                          numberOfLines={2}
                          ellipsizeMode="tail"
                        >
                          {item.subtitle}
                        </Text>
                      </View>
                    </>
                  ) : (
                    <>
                      {React.createElement(item.icon, { width: iconSize, height: iconSize })}
                      <View style={{ justifyContent: 'center', flex: 1, minWidth: 0, alignItems: 'center', width: '100%' }}>
                        <Text
                          style={{ fontSize: titleFont, fontWeight: '700', color: '#111', marginBottom: 4, fontFamily: 'Roboto', textAlign: 'center', flexShrink: 1 }}
                          numberOfLines={2}
                          ellipsizeMode="tail"
                        >
                          {item.title}
                        </Text>
                        <Text
                          style={{ fontSize: subtitleFont, color: '#222', fontFamily: 'Roboto', textAlign: 'center', flexShrink: 1 }}
                          numberOfLines={2}
                          ellipsizeMode="tail"
                        >
                          {item.subtitle}
                        </Text>
                      </View>
                    </>
                  )}
                </TouchableOpacity>
              );
            })}
          </View>
        ))}
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    backgroundColor: '#d6d6fa',
    alignItems: 'center',
    width: '100%',
  },
  heading: {
    fontWeight: '900',
    color: '#222',
    fontFamily: 'Roboto',
    textAlign: 'center',
  },
  grid: {
    alignItems: 'center',
    justifyContent: 'center',
    width: '100%',
  },
  row: {
    justifyContent: 'center',
    alignItems: 'center',
    width: '100%',
  },
  card: {
    backgroundColor: '#fff',
    borderRadius: 18,
    borderWidth: 2,
    borderColor: '#282FFB',
    shadowColor: '#000',
    shadowOpacity: 0.06,
    shadowRadius: 8,
    elevation: 2,
    alignItems: 'flex-start',
    overflow: 'hidden',
  },
});

export default ExamCategories; 