// Proctoring Configuration
// This file controls whether to use simulated or real face detection

export const PROCTORING_CONFIG = {
  // Set to true for real face detection (requires EAS Dev Client)
  // Set to false for simulated proctoring (works in Expo Go)
  ENABLE_REAL_FACE_DETECTION: false,
  
  // Simulated proctoring settings - IMPROVED FOR BETTER RESPONSIVENESS
  SIMULATED: {
    // Much faster intervals for quick detection (in milliseconds)
    WARNING_INTERVAL_MIN: 5000,  // 5 seconds (was 30 seconds)
    WARNING_INTERVAL_MAX: 15000, // 15 seconds (was 60 seconds)
    
    // Higher probabilities for more frequent detection
    FACE_NOT_VISIBLE_PROBABILITY: 0.6,  // 60% chance (was 30%)
    MULTIPLE_FACES_PROBABILITY: 0.4,     // 40% chance (was 20%)
    MOBILE_PHONE_PROBABILITY: 0.3,       // 30% chance (was 10%)
    
    // More realistic and specific warning messages
    MESSAGES: {
      FACE_NOT_VISIBLE: "⚠️ Face not detected! Please position yourself clearly in the camera view.",
      MULTIPLE_FACES: "⚠️ Multiple faces detected! Please ensure you're alone in the testing area.",
      MOBILE_PHONE: "⚠️ Mobile device detected! Please keep all phones away from the testing area.",
    }
  },
  
  // Real face detection settings - OPTIMIZED FOR ACCURACY
  REAL: {
    // Face detection sensitivity - optimized for speed and accuracy
    FACE_DETECTION_MODE: 'fast', // 'fast' | 'accurate'
    DETECT_LANDMARKS: false,
    RUN_CLASSIFICATIONS: false,
    
    // Stricter warning thresholds for better accuracy
    MIN_FACE_SIZE: 0.2, // Increased minimum face size (was 0.15)
    MAX_FACES_ALLOWED: 1,
    
    // More specific and actionable warning messages
    MESSAGES: {
      NO_FACE: "⚠️ No face detected! Please stay in the camera frame and ensure good lighting.",
      MULTIPLE_FACES: "⚠️ Multiple faces detected! Only one person should be visible in the camera.",
      FACE_TOO_SMALL: "⚠️ Face too small! Please move closer to the camera for better detection.",
    }
  }
};

// Helper function to check if real face detection is available
export const isRealFaceDetectionAvailable = (): boolean => {
  return PROCTORING_CONFIG.ENABLE_REAL_FACE_DETECTION;
};

// Helper function to get proctoring mode
export const getProctoringMode = (): 'simulated' | 'real' => {
  return PROCTORING_CONFIG.ENABLE_REAL_FACE_DETECTION ? 'real' : 'simulated';
};

// Helper function to get appropriate warning messages
export const getWarningMessages = () => {
  return PROCTORING_CONFIG.ENABLE_REAL_FACE_DETECTION 
    ? PROCTORING_CONFIG.REAL.MESSAGES 
    : PROCTORING_CONFIG.SIMULATED.MESSAGES;
}; 