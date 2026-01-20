import React, { useState } from 'react';
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  StyleSheet,
  SafeAreaView,
  Alert,
  ActivityIndicator,
  Keyboard,
  TouchableWithoutFeedback,
  Dimensions,
  ScrollView,
  useWindowDimensions,
  Image,
  Platform,
} from 'react-native';
import UserDashboardLayout from './UserDashboardLayout';

// Get initial screen dimensions
const { width: initialScreenWidth, height: initialScreenHeight } = Dimensions.get('window');

// Responsive helper functions
const wp = (percentage: number): number => {
  const { width } = Dimensions.get('window');
  return (percentage * width) / 100;
};

const hp = (percentage: number): number => {
  const { height } = Dimensions.get('window');
  return (percentage * height) / 100;
};

type DeviceType = 'mobile' | 'largeMobile' | 'tablet' | 'desktop' | 'largeDesktop';
type ResponsiveValues<T> = {
  mobile: T;
  largeMobile?: T;
  tablet?: T;
  desktop?: T;
  largeDesktop?: T;
};

// Breakpoint utilities
const getDeviceType = (width: number): DeviceType => {
  if (width < 480) return 'mobile';
  if (width < 768) return 'largeMobile';
  if (width < 1024) return 'tablet';
  if (width < 1440) return 'desktop';
  return 'largeDesktop';
};

const getResponsiveValue = <T,>(deviceType: DeviceType, values: ResponsiveValues<T>): T => {
  const { mobile, largeMobile, tablet, desktop, largeDesktop } = values;
  switch (deviceType) {
    case 'mobile':
      return mobile;
    case 'largeMobile':
      return largeMobile !== undefined ? largeMobile : mobile;
    case 'tablet':
      return tablet !== undefined ? tablet : largeMobile !== undefined ? largeMobile : mobile;
    case 'desktop':
      return desktop !== undefined ? desktop : tablet !== undefined ? tablet : largeMobile !== undefined ? largeMobile : mobile;
    case 'largeDesktop':
      return largeDesktop !== undefined ? largeDesktop : desktop !== undefined ? desktop : tablet !== undefined ? tablet : largeMobile !== undefined ? largeMobile : mobile;
    default:
      return mobile;
  }
};

const RateUsScreen = () => {
  const { width: windowWidth, height: windowHeight } = useWindowDimensions();
  const deviceType = getDeviceType(windowWidth);
  const isMobile = deviceType === 'mobile';
  const isTablet = deviceType === 'tablet';
  const isDesktop = ['desktop', 'largeDesktop'].includes(deviceType);
  
  const [rating, setRating] = useState(0);
  const [feedback, setFeedback] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [hasSubmitted, setHasSubmitted] = useState(false);

  // Responsive dimensions
  const containerWidth = getResponsiveValue(deviceType, {
    mobile: wp(90),
    largeMobile: wp(85),
    tablet: 420,
    desktop: 420, // reduced from 561
    largeDesktop: 480 // reduced from 650
  });

  const containerPadding = getResponsiveValue(deviceType, {
    mobile: 16,
    largeMobile: 20,
    tablet: 32,
    desktop: 24, // reduced from 48
    largeDesktop: 28 // reduced from 64
  });

  const titleSize = getResponsiveValue(deviceType, {
    mobile: 20,
    largeMobile: 22,
    tablet: 26,
    desktop: 32,
    largeDesktop: 36
  });

  const starSize = getResponsiveValue(deviceType, {
    mobile: wp(8),
    largeMobile: wp(7),
    tablet: 36,
    desktop: 48,
    largeDesktop: 56
  });

  const gap = getResponsiveValue(deviceType, {
    mobile: 20,
    largeMobile: 24,
    tablet: 28,
    desktop: 32,
    largeDesktop: 40
  });

  const validateInput = () => {
    if (rating === 0) {
      Alert.alert('Rating Required', 'Please select a star rating before submitting.');
      return false;
    }
    if (feedback.trim().length < 10) {
      Alert.alert('Feedback Too Short', 'Please provide at least 10 characters of feedback.');
      return false;
    }
    return true;
  };

  const submitRating = async () => {
    if (!validateInput()) return;

    setIsSubmitting(true);
    Keyboard.dismiss();

    try {
      // Simulate API call
      await new Promise(resolve => setTimeout(resolve, 2000));
      
      // Simulate random success/failure for demo
      const success = Math.random() > 0.2; // 80% success rate
      
      if (success) {
        setHasSubmitted(true);
        Alert.alert(
          'Thank You!',
          `We appreciate your ${rating}-star rating and feedback! Your review helps us improve the app.`,
          [{ text: 'OK', onPress: resetForm }]
        );
      } else {
        throw new Error('Submission failed');
      }
    } catch (error) {
      Alert.alert(
        'Submission Error',
        'Unable to submit your rating. Please check your connection and try again.',
        [
          { text: 'Cancel', style: 'cancel' },
          { text: 'Retry', onPress: submitRating }
        ]
      );
    } finally {
      setIsSubmitting(false);
    }
  };

  const resetForm = () => {
    setRating(0);
    setFeedback('');
    setHasSubmitted(false);
  };

  const getPlaceholderText = () => {
    if (rating === 0) return 'Please select a rating first...';
    if (rating <= 2) return 'Tell us what we can improve...';
    if (rating === 3) return 'Share your thoughts...';
    return 'Tell us what you loved about the app...';
  };

  // Success screen
  if (hasSubmitted) {
    return (
      <UserDashboardLayout title="Rate Us" activeLabel="Rate Us">
        <SafeAreaView style={styles.container}> 
          <ScrollView 
            contentContainerStyle={[styles.scrollContainer, { minHeight: windowHeight * 0.8 }]}
            showsVerticalScrollIndicator={false}
          >
            <View style={[
              styles.content,
              {
                width: containerWidth,
                padding: containerPadding,
                gap: gap * 0.8,
              }
            ]}>
              <Text style={[
                styles.successTitle,
                { fontSize: titleSize * 0.8 }
              ]}>
                Thank You!
              </Text>
              <Text style={[
                styles.successMessage,
                { fontSize: titleSize * 0.5 }
              ]}>
                Your {rating}-star rating has been submitted successfully.
              </Text>
              <TouchableOpacity 
                style={[
                  styles.submitButton,
                  {
                    paddingHorizontal: getResponsiveValue(deviceType, {
                      mobile: 20,
                      largeMobile: 24,
                      tablet: 28,
                      desktop: 32,
                      largeDesktop: 36
                    }),
                    paddingVertical: getResponsiveValue(deviceType, {
                      mobile: 12,
                      largeMobile: 14,
                      tablet: 16,
                      desktop: 18,
                      largeDesktop: 20
                    })
                  }
                ]} 
                onPress={resetForm}
              >
                <Text style={[
                  styles.submitButtonText,
                  { fontSize: titleSize * 0.5 }
                ]}>
                  Rate Again
                </Text>
              </TouchableOpacity>
            </View>
          </ScrollView>
        </SafeAreaView>
      </UserDashboardLayout>
    );
  }

  // Main rating screen
  return (
    <UserDashboardLayout title="Rate Us" activeLabel="Rate Us">
      <SafeAreaView style={styles.container}> 
        <ScrollView 
          contentContainerStyle={[styles.scrollContainer, { minHeight: windowHeight * 0.8 }]}
          showsVerticalScrollIndicator={false}
          keyboardShouldPersistTaps="handled"
        >
          <View style={[
            styles.content,
            {
              width: containerWidth,
              maxWidth: isDesktop ? 650 : '95%',
              padding: containerPadding,
              gap: gap,
            }
          ]}>
            <View style={{ width: isMobile ? '100%' : 433, maxWidth: 433, minWidth: 0, height: isMobile ? 'auto' : 90, gap: 16, opacity: 1, alignSelf: 'center', display: 'flex', flexDirection: 'column', justifyContent: 'flex-start' }}>
              <Text style={[
                styles.title,
                { fontSize: titleSize * 0.7, textAlign: 'left', lineHeight: titleSize * 0.85 }
              ]}>
                Studied Hard? Now Grade Us!
              </Text>
              <View style={[styles.ratingSection, { gap: 16 }]}> 
                <View style={[styles.starsContainer, { gap: gap * 0.25 }]}> 
                  {[1, 2, 3, 4, 5].map(i => (
                    <TouchableOpacity
                      key={i}
                      onPress={() => setRating(i)}
                      style={[
                        styles.starContainer,
                        { minWidth: starSize * 1.2 }
                      ]}
                      activeOpacity={0.7}
                    >
                      <Image
                        source={
                          i <= rating
                            ? require('../../assets/icons/Staricon_Rateus.png')
                            : require('../../assets/icons/star_icon_rateus.png')
                        }
                        style={[
                          styles.starImg,
                          {
                            width: starSize,
                            height: starSize,
                          }
                        ]}
                        resizeMode="contain"
                      />
                    </TouchableOpacity>
                  ))}
                </View>
                {/* Removed rating text label below stars as requested */}
              </View>
            </View>
            
            <TextInput
              style={[
                styles.textInput,
                {
                  fontSize: getResponsiveValue(deviceType, {
                    mobile: 14,
                    largeMobile: 15,
                    tablet: 16,
                    desktop: 17,
                    largeDesktop: 18
                  }),
                  padding: getResponsiveValue(deviceType, {
                    mobile: 12,
                    largeMobile: 14,
                    tablet: 16,
                    desktop: 18,
                    largeDesktop: 20
                  }),
                  minHeight: getResponsiveValue(deviceType, {
                    mobile: hp(8),
                    largeMobile: hp(9),
                    tablet: 80,
                    desktop: 100,
                    largeDesktop: 120
                  }),
                  maxHeight: getResponsiveValue(deviceType, {
                    mobile: hp(15),
                    largeMobile: hp(16),
                    tablet: 120,
                    desktop: 160,
                    largeDesktop: 200
                  })
                }
              ]}
              multiline={true}
              numberOfLines={isDesktop ? 6 : 4}
              value={feedback}
              onChangeText={setFeedback}
              placeholder={getPlaceholderText()}
              placeholderTextColor={'#999'}
              editable={rating > 0}
              maxLength={500}
              textAlignVertical="top"
            />
            
            <View style={styles.buttonContainer}>
              <Text style={[
                styles.characterCount,
                { fontSize: titleSize * 0.4 }
              ]}>
                {feedback.length}/500
              </Text>
              
              <TouchableOpacity 
                style={[
                  styles.submitButton,
                  {
                    paddingHorizontal: getResponsiveValue(deviceType, {
                      mobile: 24,
                      largeMobile: 28,
                      tablet: 32,
                      desktop: 36,
                      largeDesktop: 40
                    }),
                    paddingVertical: getResponsiveValue(deviceType, {
                      mobile: 14,
                      largeMobile: 16,
                      tablet: 18,
                      desktop: 20,
                      largeDesktop: 22
                    }),
                    opacity: (rating === 0 || isSubmitting) ? 0.5 : 1
                  }
                ]}
                onPress={submitRating}
                disabled={rating === 0 || isSubmitting}
                activeOpacity={0.8}
              >
                {isSubmitting ? (
                  <View style={styles.loadingContainer}>
                    <ActivityIndicator size="small" color="#fff" />
                    <Text style={[
                      styles.submitButtonText,
                      { fontSize: titleSize * 0.45, marginLeft: 8 }
                    ]}>
                      Submitting...
                    </Text>
                  </View>
                ) : (
                  <Text style={[
                    styles.submitButtonText,
                    { fontSize: titleSize * 0.45 }
                  ]}>
                    Submit Review
                  </Text>
                )}
              </TouchableOpacity>
            </View>
          </View>
        </ScrollView>
      </SafeAreaView>
    </UserDashboardLayout>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff',
  },
  scrollContainer: {
    flexGrow: 1,
    justifyContent: 'center',
    alignItems: 'center',
    paddingVertical: 20,
  },
  content: {
    backgroundColor: '#282FFB0D',
    borderRadius: 8,
    alignItems: 'flex-start',
    alignSelf: 'center',
    width: '100%',
    maxWidth: 561,
    minWidth: 0,
    height: 'auto',
    minHeight: 320,
    padding: 16,
    gap: 24,
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.1,
    shadowRadius: 8,
    elevation: 4,
    opacity: 1,
  },
  title: {
    fontWeight: '700',
    color: '#222',
    textAlign: 'left',
    width: '100%',
    lineHeight: 1.2,
  },
  ratingSection: {
    width: '100%',
    alignItems: 'flex-start',
  },
  starsContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    flexWrap: 'wrap',
  },
  starContainer: {
    padding: 4,
    alignItems: 'center',
    justifyContent: 'center',
  },
  starImg: {
    marginHorizontal: 2,
  },
  ratingText: {
    color: '#666',
    fontWeight: '600',
    marginTop: 8,
  },
  textInput: {
    backgroundColor: '#fff',
    borderRadius: 8,
    borderWidth: 1.5,
    borderColor: '#4f46e5',
    color: '#222',
    width: '100%',
    fontFamily: Platform.OS === 'ios' ? 'System' : 'Roboto',
  },
  buttonContainer: {
    width: '100%',
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  characterCount: {
    color: '#666',
    fontWeight: '500',
  },
  submitButton: {
    backgroundColor: '#e91e63',
    borderRadius: 25,
    alignItems: 'center',
    justifyContent: 'center',
    shadowColor: '#e91e63',
    shadowOffset: {
      width: 0,
      height: 4,
    },
    shadowOpacity: 0.3,
    shadowRadius: 8,
    elevation: 6,
  },
  submitButtonText: {
    color: '#fff',
    fontWeight: '600',
  },
  loadingContainer: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  successTitle: {
    fontWeight: '700',
    color: '#222',
    textAlign: 'center',
    width: '100%',
  },
  successMessage: {
    color: '#333',
    textAlign: 'center',
    lineHeight: 1.4,
    width: '100%',
  },
});

export default RateUsScreen;