import React from 'react';
import { View, Text, StyleSheet, useWindowDimensions, TouchableOpacity, Image } from 'react-native';

const VidyankAppDownload = () => {
  const { width } = useWindowDimensions();
  const isMobile = width <= 480;
  const isTablet = width >= 800 && width < 1200;

  return (
    <View style={{
      ...styles.container,
      paddingVertical: isMobile ? 48 : 0,
    }}>
      <View style={[
        styles.contentWrapper,
        {
          flexDirection: isMobile ? 'column' : 'row',
          alignItems: isMobile ? 'flex-start' : 'center',
          justifyContent: isMobile ? 'flex-start' : 'space-between',
          maxWidth: isMobile ? '100%' : 1200,
          width: '100%',
        }
      ]}>
        {/* Content - Left Side (on desktop), Below image on mobile */}
        {!isMobile && (
          <View style={[
            styles.contentArea,
            {
              width: '50%',
              alignItems: 'flex-start',
              paddingHorizontal: 0,
            }
          ]}>
            <Text style={[
              styles.heading,
              {
                fontSize: isMobile ? 24 : 36,
                lineHeight: isMobile ? 28 : 41,
                marginBottom: isMobile ? 16 : 20,
                textAlign: isMobile ? 'left' : 'left',
              }
            ]}>
              {isMobile ? (
                <>Download Vidyank App{"\n"}for <Text style={styles.freeText}>FREE</Text></>
              ) : (
                <>Download Vidyank App for <Text style={styles.freeText}>FREE</Text></>
              )}
            </Text>
            <Text style={[
              styles.description,
              {
                fontSize: isMobile ? 16 : 20,
                lineHeight: isMobile ? 24 : 30,
                marginBottom: isMobile ? 24 : 32,
                textAlign: isMobile ? 'left' : 'left',
                paddingHorizontal: 0,
              }
            ]}>
              Boost your exam performance with Vidyank – a free platform for smart online preparation and test series. Access video lectures, practice tests, and expert guidance anytime, anywhere.
            </Text>
            {/* App Store Buttons */}
            <View style={[
              styles.buttonContainer,
              {
                flexDirection: isMobile ? 'column' : 'row',
                alignItems: isMobile ? 'flex-start' : 'flex-start',
                justifyContent: isMobile ? 'flex-start' : 'flex-start',
                width: '100%',
              }
            ]}>
              <TouchableOpacity
                style={[
                  styles.storeButton,
                  {
                    marginBottom: isMobile ? 12 : 0,
                    marginRight: isMobile ? 0 : 16,
                  }
                ]}
                activeOpacity={0.8}
              >
                <Image
                  source={require('../../assets/icons/image 2.png')}
                  style={[
                    styles.storeButtonImage,
                    {
                      width: isMobile ? 160 : 180,
                      height: isMobile ? 48 : 54,
                    }
                  ]}
                  resizeMode="contain"
                />
              </TouchableOpacity>
              <TouchableOpacity
                style={styles.storeButton}
                activeOpacity={0.8}
              >
                <Image
                  source={require('../../assets/icons/image 3.png')}
                  style={[
                    styles.storeButtonImage,
                    {
                      width: isMobile ? 160 : 180,
                      height: isMobile ? 48 : 54,
                    }
                  ]}
                  resizeMode="contain"
                />
              </TouchableOpacity>
            </View>
          </View>
        )}
        {/* Student Image - Right Side on desktop, Top on mobile */}
        <View style={[
          styles.imageContainer,
          {
            width: isMobile ? '100%' : '50%',
            alignItems: isMobile ? 'flex-start' : 'center',
            marginBottom: isMobile ? 20 : 0,
            marginRight: isMobile ? 0 : 60, // more right margin for desktop
          }
        ]}>
          <Image
            source={require('../../assets/icons/8833866 1.png')}
            style={[
              styles.studentImage,
              {
                width: isMobile ? 396 : 520, // slightly bigger for desktop
                height: isMobile ? 396 : 520,
              }
            ]}
            resizeMode="contain"
          />
        </View>
        {/* Content - Mobile only (below image) */}
        {isMobile && (
          <View style={[
            styles.contentArea,
            {
              width: '100%',
              alignItems: 'flex-start',
              paddingHorizontal: 0,
            }
          ]}>
            <Text style={[
              styles.heading,
              {
                fontSize: isMobile ? 24 : 36,
                lineHeight: isMobile ? 28 : 41,
                marginBottom: isMobile ? 16 : 20,
                textAlign: isMobile ? 'center' : 'left',
                width: isMobile ? '100%' : undefined,
              }
            ]}>
              {isMobile ? (
                <>Download Vidyank App{"\n"}for <Text style={styles.freeText}>FREE</Text></>
              ) : (
                <>Download Vidyank App for <Text style={styles.freeText}>FREE</Text></>
              )}
            </Text>
            <Text style={[
              styles.description,
              {
                fontSize: isMobile ? 16 : 20,
                lineHeight: isMobile ? 24 : 30,
                marginBottom: isMobile ? 24 : 32,
                textAlign: isMobile ? 'center' : 'left',
                paddingHorizontal: 0,
              }
            ]}>
              Boost your exam performance with Vidyank – a free platform for smart online preparation and test series. Access video lectures, practice tests, and expert guidance anytime, anywhere.
            </Text>
            {/* App Store Buttons */}
            <View style={[
              styles.buttonContainer,
              {
                flexDirection: isMobile ? 'row' : 'row',
                alignItems: 'center',
                justifyContent: isMobile ? 'center' : 'flex-start',
                width: '100%',
              }
            ]}>
              {isMobile ? (
                <>
                  <TouchableOpacity
                    style={[
                      styles.storeButton,
                      { marginRight: 12 }
                    ]}
                    activeOpacity={0.8}
                  >
                    <Image
                      source={require('../../assets/icons/image 3.png')}
                      style={[
                        styles.storeButtonImage,
                        {
                          width: 160,
                          height: 48,
                        }
                      ]}
                      resizeMode="contain"
                    />
                  </TouchableOpacity>
                  <TouchableOpacity
                    style={styles.storeButton}
                    activeOpacity={0.8}
                  >
                    <Image
                      source={require('../../assets/icons/image 2.png')}
                      style={[
                        styles.storeButtonImage,
                        {
                          width: 160,
                          height: 48,
                        }
                      ]}
                      resizeMode="contain"
                    />
                  </TouchableOpacity>
                </>
              ) : (
                <>
                  <TouchableOpacity
                    style={[
                      styles.storeButton,
                      {
                        marginRight: 16,
                      }
                    ]}
                    activeOpacity={0.8}
                  >
                    <Image
                      source={require('../../assets/icons/image 2.png')}
                      style={[
                        styles.storeButtonImage,
                        {
                          width: 180,
                          height: 54,
                        }
                      ]}
                      resizeMode="contain"
                    />
                  </TouchableOpacity>
                  <TouchableOpacity
                    style={styles.storeButton}
                    activeOpacity={0.8}
                  >
                    <Image
                      source={require('../../assets/icons/image 3.png')}
                      style={[
                        styles.storeButtonImage,
                        {
                          width: 180,
                          height: 54,
                        }
                      ]}
                      resizeMode="contain"
                    />
                  </TouchableOpacity>
                </>
              )}
            </View>
          </View>
        )}
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    backgroundColor: '#ffffff',
    alignItems: 'center',
    justifyContent: 'center',
    width: '100%',
    borderRadius: 0,
    alignSelf: 'center',
  },
  contentWrapper: {
    alignItems: 'flex-start',
    justifyContent: 'flex-start',
    width: '100%',
  },
  imageContainer: {
    alignItems: 'flex-start',
    justifyContent: 'flex-start',
  },
  studentImage: {
    borderRadius: 8,
  },
  contentArea: {
    alignItems: 'flex-start',
    justifyContent: 'flex-start',
  },
  heading: {
    fontFamily: 'Roboto',
    fontWeight: '700',
    color: '#000',
    letterSpacing: -1.8, // -5% of 36px
  },
  freeText: {
    color: '#4285f4',
  },
  description: {
    fontFamily: 'Roboto',
    fontWeight: '400',
    color: '#555',
    letterSpacing: 0,
  },
  buttonContainer: {
    alignItems: 'center',
    justifyContent: 'center',
  },
  storeButton: {
    borderRadius: 8,
    overflow: 'hidden',
    elevation: 2,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
  },
  storeButtonImage: {
    // Dynamic sizing handled in component
  },
});

export default VidyankAppDownload;