import React, { useEffect, useRef } from 'react';
import { View, Text, StyleSheet, Animated, Easing, useWindowDimensions, Platform } from 'react-native';
import * as Svg from 'react-native-svg';

const SEGMENTS = 9;
const RADIUS = 140;
const STROKE = 60;
const CENTER = RADIUS + STROKE / 2;
const DIAMETER = CENTER * 2;
const COLORS = [
  '#2563eb', '#38bdf8', '#22d3ee', '#2dd4bf', '#4ade80', '#facc15', '#f59e42', '#f97316', '#ef4444'
];
const TITLES = [
  'Step 1', 'Step 2', 'Step 3', 'Step 4', 'Step 5', 'Step 6', 'Step 7', 'Step 8', 'Step 9'
];
const DESCS = [
  'This is a sample text.', 'This is a sample text.', 'This is a sample text.',
  'This is a sample text.', 'This is a sample text.', 'This is a sample text.',
  'This is a sample text.', 'This is a sample text.', 'This is a sample text.'
];

function polarToCartesian(cx: number, cy: number, r: number, angle: number) {
  const a = ((angle - 90) * Math.PI) / 180.0;
  return {
    x: cx + r * Math.cos(a),
    y: cy + r * Math.sin(a),
  };
}

function describeArc(cx: number, cy: number, r: number, startAngle: number, endAngle: number) {
  const start = polarToCartesian(cx, cy, r, endAngle);
  const end = polarToCartesian(cx, cy, r, startAngle);
  const largeArcFlag = endAngle - startAngle <= 180 ? '0' : '1';
  return [
    'M', start.x, start.y,
    'A', r, r, 0, largeArcFlag, 0, end.x, end.y
  ].join(' ');
}

const CircularSteps = () => {
  const anims = useRef(Array.from({ length: SEGMENTS }, () => new Animated.Value(0))).current;
  const { width: windowWidth } = useWindowDimensions();
  const isMobile = windowWidth < 480;

  useEffect(() => {
    // Animate each segment in sequence
    Animated.stagger(120, anims.map(anim =>
      Animated.timing(anim, {
        toValue: 1,
        duration: 600,
        useNativeDriver: Platform.OS !== 'web',
        easing: Easing.out(Easing.exp),
      })
    )).start();
  }, []);

  const anglePer = 360 / SEGMENTS;

  return (
    <View style={styles.container}>
      <Svg.Svg width={DIAMETER} height={DIAMETER}>
        <Svg.G>
          {Array.from({ length: SEGMENTS }).map((_, i) => {
            const startAngle = i * anglePer;
            const endAngle = (i + 1) * anglePer;
            const path = describeArc(CENTER, CENTER, RADIUS, startAngle, endAngle);
            return (
              <Svg.Path
                key={i}
                d={path}
                stroke={COLORS[i]}
                strokeWidth={STROKE}
                fill="none"
                strokeLinecap="butt"
                opacity={Number(anims[i].interpolate({ inputRange: [0, 1], outputRange: [0, 1] }))}
              />
            );
          })}
        </Svg.G>
      </Svg.Svg>
      {/* Place content in a circle */}
      {Array.from({ length: SEGMENTS }).map((_, i) => {
        const angle = (i + 0.5) * anglePer;
        const pos = polarToCartesian(CENTER, CENTER, RADIUS, angle);
        return (
          <Animated.View
            key={i}
            style={[
              styles.segmentContent,
              {
                left: pos.x - 50,
                top: pos.y - 40,
                opacity: anims[i],
                transform: [{ scale: anims[i].interpolate({ inputRange: [0, 1], outputRange: [0.7, 1] }) }],
              },
            ]}
          >
            <View style={[styles.segmentBubble, { backgroundColor: COLORS[i] }]}> 
              <Text style={styles.segmentNumber}>{i + 1}</Text>
            </View>
            <Text style={styles.segmentTitle}>{TITLES[i]}</Text>
            <Text style={styles.segmentDesc}>{DESCS[i]}</Text>
          </Animated.View>
        );
      })}
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    width: DIAMETER,
    height: DIAMETER,
    alignItems: 'center',
    justifyContent: 'center',
    alignSelf: 'center',
  },
  segmentContent: {
    position: 'absolute',
    width: 100,
    height: 80,
    alignItems: 'center',
    justifyContent: 'center',
  },
  segmentBubble: {
    width: 32,
    height: 32,
    borderRadius: 16,
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: 4,
    elevation: 2,
  },
  segmentNumber: {
    color: '#fff',
    fontWeight: 'bold',
    fontSize: 16,
  },
  segmentTitle: {
    fontWeight: 'bold',
    fontSize: 13,
    color: '#222',
    textAlign: 'center',
  },
  segmentDesc: {
    fontSize: 11,
    color: '#444',
    textAlign: 'center',
  },
});

export default CircularSteps; 