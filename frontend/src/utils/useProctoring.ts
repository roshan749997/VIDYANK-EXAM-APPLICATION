import { useState, useEffect, useRef } from 'react';
import { PROCTORING_CONFIG, isRealFaceDetectionAvailable } from '../config/proctoringConfig';

export interface ProctoringWarning {
  type: 'face_not_visible' | 'multiple_faces' | 'mobile_phone' | 'face_too_small';
  message: string;
  timestamp: number;
  severity: 'low' | 'medium' | 'high';
}

export const useProctoring = (testStarted: boolean, testEnded: boolean) => {
  const [warnings, setWarnings] = useState<ProctoringWarning[]>([]);
  const [showModal, setShowModal] = useState(false);
  const [isMonitoring, setIsMonitoring] = useState(false);
  const proctoringTimerRef = useRef<NodeJS.Timeout | null>(null);
  const continuousTimerRef = useRef<NodeJS.Timeout | null>(null);

  // Enhanced simulated proctoring logic with continuous monitoring
  const startSimulatedProctoring = () => {
    if (!testStarted || testEnded) return;
    
    setIsMonitoring(true);

    // Continuous monitoring every 2 seconds for immediate response
    const startContinuousMonitoring = () => {
      continuousTimerRef.current = setInterval(() => {
        const random = Math.random();
        const newWarnings: ProctoringWarning[] = [];
        
        // Quick face detection check (most common)
        if (random < 0.4) { // 40% chance every 2 seconds
          newWarnings.push({
            type: 'face_not_visible',
            message: PROCTORING_CONFIG.SIMULATED.MESSAGES.FACE_NOT_VISIBLE,
            timestamp: Date.now(),
            severity: 'high'
          });
        }
        
        // Multiple faces check
        if (random < 0.2) { // 20% chance every 2 seconds
          newWarnings.push({
            type: 'multiple_faces',
            message: PROCTORING_CONFIG.SIMULATED.MESSAGES.MULTIPLE_FACES,
            timestamp: Date.now(),
            severity: 'medium'
          });
        }
        
        // Mobile phone check
        if (random < 0.15) { // 15% chance every 2 seconds
          newWarnings.push({
            type: 'mobile_phone',
            message: PROCTORING_CONFIG.SIMULATED.MESSAGES.MOBILE_PHONE,
            timestamp: Date.now(),
            severity: 'high'
          });
        }
        
        if (newWarnings.length > 0) {
          setWarnings(newWarnings);
          setShowModal(true);
          
          // Auto-hide after 3 seconds (faster response)
          setTimeout(() => {
            setShowModal(false);
            setWarnings([]);
          }, 3000);
        }
      }, 2000); // Check every 2 seconds
    };

    // Additional random warnings for unpredictability
    const scheduleRandomWarnings = () => {
      const scheduleNextWarning = () => {
        const interval = PROCTORING_CONFIG.SIMULATED.WARNING_INTERVAL_MIN + 
          Math.random() * (PROCTORING_CONFIG.SIMULATED.WARNING_INTERVAL_MAX - PROCTORING_CONFIG.SIMULATED.WARNING_INTERVAL_MIN);
        
        proctoringTimerRef.current = setTimeout(() => {
          const random = Math.random();
          const newWarnings: ProctoringWarning[] = [];
          
          if (random < PROCTORING_CONFIG.SIMULATED.FACE_NOT_VISIBLE_PROBABILITY) {
            newWarnings.push({
              type: 'face_not_visible',
              message: PROCTORING_CONFIG.SIMULATED.MESSAGES.FACE_NOT_VISIBLE,
              timestamp: Date.now(),
              severity: 'high'
            });
          }
          
          if (random < PROCTORING_CONFIG.SIMULATED.MULTIPLE_FACES_PROBABILITY) {
            newWarnings.push({
              type: 'multiple_faces',
              message: PROCTORING_CONFIG.SIMULATED.MESSAGES.MULTIPLE_FACES,
              timestamp: Date.now(),
              severity: 'medium'
            });
          }
          
          if (random < PROCTORING_CONFIG.SIMULATED.MOBILE_PHONE_PROBABILITY) {
            newWarnings.push({
              type: 'mobile_phone',
              message: PROCTORING_CONFIG.SIMULATED.MESSAGES.MOBILE_PHONE,
              timestamp: Date.now(),
              severity: 'high'
            });
          }
          
          if (newWarnings.length > 0) {
            setWarnings(newWarnings);
            setShowModal(true);
            
            // Auto-hide after 3 seconds
            setTimeout(() => {
              setShowModal(false);
              setWarnings([]);
            }, 3000);
          }
          
          // Schedule next warning
          scheduleNextWarning();
        }, interval);
      };
      
      scheduleNextWarning();
    };
    
    // Start both monitoring systems
    startContinuousMonitoring();
    scheduleRandomWarnings();
  };

  // Enhanced real face detection logic with better accuracy
  const handleRealFaceDetection = (faces: any[]) => {
    if (!testStarted || testEnded) return;
    
    const newWarnings: ProctoringWarning[] = [];
    
    if (!faces || faces.length === 0) {
      newWarnings.push({
        type: 'face_not_visible',
        message: PROCTORING_CONFIG.REAL.MESSAGES.NO_FACE,
        timestamp: Date.now(),
        severity: 'high'
      });
    } else if (faces.length > PROCTORING_CONFIG.REAL.MAX_FACES_ALLOWED) {
      newWarnings.push({
        type: 'multiple_faces',
        message: PROCTORING_CONFIG.REAL.MESSAGES.MULTIPLE_FACES,
        timestamp: Date.now(),
        severity: 'high'
      });
    } else if (faces.length === 1) {
      // Enhanced face size analysis
      const face = faces[0];
      const faceSize = face.bounds.size.width * face.bounds.size.height;
      const frameSize = 1; // Assuming normalized coordinates
      
      if (faceSize < PROCTORING_CONFIG.REAL.MIN_FACE_SIZE * frameSize) {
        newWarnings.push({
          type: 'face_too_small',
          message: PROCTORING_CONFIG.REAL.MESSAGES.FACE_TOO_SMALL,
          timestamp: Date.now(),
          severity: 'medium'
        });
      }
    }
    
    if (newWarnings.length > 0) {
      setWarnings(newWarnings);
      setShowModal(true);
      
      // Auto-hide after 3 seconds
      setTimeout(() => {
        setShowModal(false);
        setWarnings([]);
      }, 3000);
    }
  };

  // Start proctoring based on configuration
  useEffect(() => {
    if (isRealFaceDetectionAvailable()) {
      // Real face detection will be handled by camera component
      setIsMonitoring(true);
      return;
    } else {
      // Start enhanced simulated proctoring
      startSimulatedProctoring();
    }

    return () => {
      if (proctoringTimerRef.current) {
        clearTimeout(proctoringTimerRef.current);
      }
      if (continuousTimerRef.current) {
        clearInterval(continuousTimerRef.current);
      }
      setIsMonitoring(false);
    };
  }, [testStarted, testEnded]);

  const dismissModal = () => {
    setShowModal(false);
    setWarnings([]);
  };

  return {
    warnings,
    showModal,
    dismissModal,
    handleRealFaceDetection,
    isRealMode: isRealFaceDetectionAvailable(),
    isMonitoring,
  };
}; 