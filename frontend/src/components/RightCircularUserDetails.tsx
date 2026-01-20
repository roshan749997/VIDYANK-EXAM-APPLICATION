import React, { useRef, useState, useEffect } from 'react';
import { View, Text, StyleSheet, TouchableOpacity, Animated, Easing, Dimensions, useWindowDimensions, Platform } from 'react-native';
import * as Svg from 'react-native-svg';
import { Ionicons } from '@expo/vector-icons';

const SEGMENTS = 7;
const RADIUS = 140;
const STROKE = 60;
const CENTER = RADIUS + STROKE / 2;
const DIAMETER = CENTER * 2;
const COLORS = [
  '#2563eb', '#38bdf8', '#22d3ee', '#2dd4bf', '#4ade80', '#facc15', '#ef4444'
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

interface RightCircularUserDetailsProps {
  user: any;
}

const RightCircularUserDetails: React.FC<RightCircularUserDetailsProps> = ({ user }) => {
  const [open, setOpen] = useState(false);
  const anim = useRef(new Animated.Value(0)).current;
  const rotationAnims = useRef(COLORS.map(() => new Animated.Value(0))).current;
  const pulseAnim = useRef(new Animated.Value(1)).current;
  
  const { width: screenWidth, height: screenHeight } = Dimensions.get('window');
  const { width: windowWidth } = useWindowDimensions();
  const isMobile = windowWidth < 480;
  const circleDiameter = Math.max(340, Math.min(400, Math.min(screenWidth, screenHeight) * 0.9));
  const right = 0;
  const top = screenHeight / 2 - circleDiameter / 2;

  // Start segment rotation animations
  useEffect(() => {
    if (open) {
      // Start pulse animation
      Animated.loop(
        Animated.sequence([
          Animated.timing(pulseAnim, {
            toValue: 1.05,
            duration: 2000,
            easing: Easing.inOut(Easing.sin),
            useNativeDriver: Platform.OS !== 'web',
          }),
          Animated.timing(pulseAnim, {
            toValue: 1,
            duration: 2000,
            easing: Easing.inOut(Easing.sin),
            useNativeDriver: Platform.OS !== 'web',
          }),
        ])
      ).start();
    } else {
      // Stop animations
      rotationAnims.forEach(rotAnim => rotAnim.stopAnimation());
      pulseAnim.stopAnimation();
      pulseAnim.setValue(1);
    }
  }, [open]);

  const openCircle = () => {
    setOpen(true);
    Animated.timing(anim, {
      toValue: 1,
      duration: 500,
      easing: Easing.out(Easing.exp),
      useNativeDriver: Platform.OS !== 'web',
    }).start();
  };

  const closeCircle = () => {
    Animated.timing(anim, {
      toValue: 0,
      duration: 400,
      easing: Easing.in(Easing.exp),
      useNativeDriver: Platform.OS !== 'web',
    }).start(() => setOpen(false));
  };

  // Animate scale and opacity
  const scale = anim.interpolate({ inputRange: [0, 1], outputRange: [0, 1] });
  const opacity = anim.interpolate({ inputRange: [0, 0.7, 1], outputRange: [0, 0.9, 1] });

  return (
    <View style={StyleSheet.absoluteFill} pointerEvents="box-none">
      {/* Collapsed user icon button on right */}
      {!open && (
        <TouchableOpacity
          style={styles.fab}
          onPress={openCircle}
          activeOpacity={0.8}
        >
          <Ionicons name="person-circle-outline" size={48} color="#4f46e5" />
        </TouchableOpacity>
      )}
      
      {/* Animated expanding circle with user details */}
      {open && (
        <Animated.View
          style={[
            styles.animatedCircle,
            {
              right,
              top,
              width: circleDiameter,
              height: circleDiameter,
              borderRadius: circleDiameter / 2,
              transform: [{ scale }],
              opacity,
            },
          ]}
        >
          {/* Animated colorful segments */}
          <Animated.View
            style={[
              StyleSheet.absoluteFill,
              {
                transform: [{ scale: pulseAnim }],
              },
            ]}
          >
            <Svg.Svg width={circleDiameter} height={circleDiameter} style={StyleSheet.absoluteFill}>
              <Svg.G>
                {Array.from({ length: SEGMENTS }).map((_, i) => {
                  const anglePer = 360 / SEGMENTS;
                  const startAngle = i * anglePer;
                  const endAngle = (i + 1) * anglePer;
                  const path = describeArc(circleDiameter / 2, circleDiameter / 2, RADIUS, startAngle, endAngle);
                  return (
                    <Svg.G key={i}>
                      <Svg.Path
                        d={path}
                        stroke={COLORS[i]}
                        strokeWidth={STROKE}
                        fill="none"
                        strokeLinecap="round"
                        opacity={0.9}
                      />
                    </Svg.G>
                  );
                })}
              </Svg.G>
            </Svg.Svg>
          </Animated.View>

          {/* Truly circular content area - clipped to perfect circle */}
          <View 
            style={[
              styles.circularContentContainer,
              {
                width: circleDiameter * 0.65,
                height: circleDiameter * 0.65,
                borderRadius: (circleDiameter * 0.65) / 2,
              }
            ]}
          >
            {/* This creates the circular clipping mask */}
            <View style={[
              styles.circularContent,
              {
                width: circleDiameter * 0.65,
                height: circleDiameter * 0.65,
                borderRadius: (circleDiameter * 0.65) / 2,
              }
            ]}>
              {/* Content arranged in circular layout */}
              <View style={styles.profileHeader}>
                <View style={styles.profileIconContainer}>
                  <Ionicons name="person-circle" size={50} color="#4f46e5" />
                </View>
                <Text style={styles.profileName} numberOfLines={1}>
                  {user?.firstName && user?.lastName ? `${user.firstName} ${user.lastName}` : user?.name || 'John Doe'}
                </Text>
              </View>

              <View style={styles.profileDetails}>
                <View style={styles.detailRow}>
                  <Ionicons name="mail" size={16} color="#6366f1" style={styles.detailIcon} />
                  <Text style={styles.profileField} numberOfLines={1}>
                    {user?.email || 'john.doe@email.com'}
                  </Text>
                </View>
                
                <View style={styles.detailRow}>
                  <Ionicons name="call" size={16} color="#06b6d4" style={styles.detailIcon} />
                  <Text style={styles.profileField} numberOfLines={1}>
                    {user?.phone || '+1 234 567 8900'}
                  </Text>
                </View>
                
                <View style={styles.detailRow}>
                  <Ionicons name="location" size={16} color="#ef4444" style={styles.detailIcon} />
                  <Text style={styles.profileField} numberOfLines={1}>
                    {user?.city || 'City'}
                  </Text>
                </View>
                
                <View style={styles.detailRow}>
                  <Ionicons name="school" size={16} color="#10b981" style={styles.detailIcon} />
                  <Text style={styles.profileField} numberOfLines={1}>
                    {user?.category || 'Category'}
                  </Text>
                </View>
                
                <View style={styles.detailRow}>
                  <Ionicons name="business" size={16} color="#f59e0b" style={styles.detailIcon} />
                  <Text style={styles.profileField} numberOfLines={2}>
                    {user?.instituteName || 'Institute/Class'}
                  </Text>
                </View>
                {/* Add referralSource and other registration fields to the details section */}
                <View style={styles.detailRow}>
                  <Ionicons name="share-social" size={16} color="#6366f1" style={styles.detailIcon} />
                  <Text style={styles.profileField} numberOfLines={1}>
                    {user?.referralSource || 'Referral Source'}
                  </Text>
                </View>
                <View style={styles.detailRow}>
                  <Ionicons name="shield-checkmark" size={16} color="#6366f1" style={styles.detailIcon} />
                  <Text style={styles.profileField} numberOfLines={1}>
                    {user?.termsAccepted ? 'Terms Accepted' : 'Terms Not Accepted'}
                  </Text>
                </View>
              </View>

              {/* Close button positioned at bottom of circle */}
              <TouchableOpacity style={styles.closeFab} onPress={closeCircle}>
                <Ionicons name="close" size={24} color="#fff" />
              </TouchableOpacity>
            </View>
          </View>
        </Animated.View>
      )}
    </View>
  );
};

const styles = StyleSheet.create({
  fab: {
    position: 'absolute',
    right: 24,
    top: '50%',
    marginTop: -32,
    zIndex: 100,
    backgroundColor: '#fff',
    borderRadius: 32,
    elevation: 6,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.1,
    shadowRadius: 8,
    padding: 2,
  },
  animatedCircle: {
    position: 'absolute',
    justifyContent: 'center',
    alignItems: 'center',
    zIndex: 9999,
  },
  circularContentContainer: {
    position: 'absolute',
    overflow: 'hidden', // This ensures perfect circular clipping
    elevation: 12,
    shadowColor: '#4f46e5',
    shadowOffset: { width: 0, height: 8 },
    shadowOpacity: 0.25,
    shadowRadius: 24,
  },
  circularContent: {
    backgroundColor: 'rgba(255, 255, 255, 0.98)',
    overflow: 'hidden', // Ensures content stays within circle
    paddingTop: 20,
    paddingHorizontal: 20,
    paddingBottom: 60, // Space for close button
    justifyContent: 'flex-start',
    alignItems: 'center',
  },
  profileHeader: {
    alignItems: 'center',
    marginBottom: 20,
  },
  profileIconContainer: {
    marginBottom: 8,
    backgroundColor: 'rgba(79, 70, 229, 0.1)',
    borderRadius: 30,
    padding: 8,
  },
  profileName: {
    fontWeight: 'bold',
    fontSize: 18,
    color: '#1f2937',
    textAlign: 'center',
  },
  profileDetails: {
    width: '100%',
    flex: 1,
  },
  detailRow: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 12,
    paddingHorizontal: 4,
  },
  detailIcon: {
    marginRight: 10,
    width: 20,
  },
  profileField: {
    fontSize: 13,
    color: '#374151',
    flex: 1,
    fontWeight: '500',
  },
  closeFab: {
    position: 'absolute',
    bottom: 15,
    alignSelf: 'center',
    backgroundColor: '#4f46e5',
    borderRadius: 18,
    width: 36,
    height: 36,
    justifyContent: 'center',
    alignItems: 'center',
    elevation: 6,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 3 },
    shadowOpacity: 0.2,
    shadowRadius: 8,
  },
});

export default RightCircularUserDetails;