import React from 'react';
import {
  View,
  Text,
  TouchableOpacity,
  Modal,
  StyleSheet,
  Animated,
} from 'react-native';
import { ProctoringWarning } from '../utils/useProctoring';

interface ProctoringModalProps {
  visible: boolean;
  warnings: ProctoringWarning[];
  onDismiss: () => void;
  mode: 'simulated' | 'real';
}

export const ProctoringModal: React.FC<ProctoringModalProps> = ({
  visible,
  warnings,
  onDismiss,
  mode,
}) => {
  const getWarningIcon = (type: ProctoringWarning['type']) => {
    switch (type) {
      case 'face_not_visible':
        return '👤';
      case 'multiple_faces':
        return '👥';
      case 'mobile_phone':
        return '📱';
      case 'face_too_small':
        return '🔍';
      default:
        return '⚠️';
    }
  };

  const getWarningColor = (type: ProctoringWarning['type'], severity: ProctoringWarning['severity']) => {
    const baseColors = {
      face_not_visible: '#dc3545',
      multiple_faces: '#fd7e14',
      mobile_phone: '#6f42c1',
      face_too_small: '#ffc107',
    };
    
    const baseColor = baseColors[type] || '#dc3545';
    
    // Adjust color based on severity
    switch (severity) {
      case 'high':
        return baseColor;
      case 'medium':
        return baseColor + 'CC'; // Add transparency
      case 'low':
        return baseColor + '99'; // More transparency
      default:
        return baseColor;
    }
  };

  const getSeverityBadge = (severity: ProctoringWarning['severity']) => {
    const severityConfig = {
      high: { text: 'HIGH', color: '#dc3545', bgColor: '#f8d7da' },
      medium: { text: 'MEDIUM', color: '#fd7e14', bgColor: '#fff3cd' },
      low: { text: 'LOW', color: '#6c757d', bgColor: '#e9ecef' },
    };
    
    const config = severityConfig[severity] || severityConfig.low;
    
    return (
      <View style={[styles.severityBadge, { backgroundColor: config.bgColor }]}>
        <Text style={[styles.severityText, { color: config.color }]}>
          {config.text}
        </Text>
      </View>
    );
  };

  return (
    <Modal
      visible={visible}
      transparent={true}
      animationType="fade"
    >
      <View style={styles.modalOverlay}>
        <View style={styles.modalContent}>
          <View style={styles.header}>
            <Text style={styles.modalTitle}>🚨 Proctoring Alert</Text>
            <View style={styles.modeBadge}>
              <Text style={styles.modeText}>
                {mode === 'real' ? '🔍 Real Detection' : '🎭 Simulated'}
              </Text>
            </View>
          </View>
          
          <View style={styles.warningsContainer}>
            {warnings.map((warning, index) => (
              <View key={index} style={styles.warningItem}>
                <View style={styles.warningHeader}>
                  <Text style={styles.warningIcon}>
                    {getWarningIcon(warning.type)}
                  </Text>
                  {getSeverityBadge(warning.severity)}
                </View>
                <Text style={[
                  styles.warningText,
                  { color: getWarningColor(warning.type, warning.severity) }
                ]}>
                  {warning.message}
                </Text>
                <Text style={styles.timestamp}>
                  {new Date(warning.timestamp).toLocaleTimeString()}
                </Text>
              </View>
            ))}
          </View>
          
          <TouchableOpacity 
            style={styles.modalButton}
            onPress={onDismiss}
          >
            <Text style={styles.modalButtonText}>✓ Acknowledge</Text>
          </TouchableOpacity>
          
          <Text style={styles.footerText}>
            {mode === 'real' 
              ? '🔍 Real-time face analysis active' 
              : '🎭 Enhanced simulated monitoring active'
            }
          </Text>
        </View>
      </View>
    </Modal>
  );
};

const styles = StyleSheet.create({
  modalOverlay: {
    flex: 1,
    backgroundColor: 'rgba(0, 0, 0, 0.6)',
    justifyContent: 'center',
    alignItems: 'center',
  },
  modalContent: {
    backgroundColor: 'white',
    borderRadius: 16,
    padding: 24,
    margin: 20,
    alignItems: 'center',
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 6,
    },
    shadowOpacity: 0.4,
    shadowRadius: 12,
    elevation: 10,
    maxWidth: 400,
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    width: '100%',
    marginBottom: 20,
  },
  modalTitle: {
    fontSize: 22,
    fontWeight: 'bold',
    color: '#dc3545',
    flex: 1,
  },
  modeBadge: {
    backgroundColor: '#e9ecef',
    paddingHorizontal: 10,
    paddingVertical: 6,
    borderRadius: 16,
  },
  modeText: {
    fontSize: 12,
    color: '#6c757d',
    fontWeight: '600',
  },
  warningsContainer: {
    width: '100%',
    marginBottom: 24,
  },
  warningItem: {
    marginBottom: 16,
    paddingHorizontal: 12,
    paddingVertical: 8,
    backgroundColor: '#f8f9fa',
    borderRadius: 12,
    borderLeftWidth: 4,
    borderLeftColor: '#dc3545',
  },
  warningHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginBottom: 8,
  },
  warningIcon: {
    fontSize: 24,
    marginRight: 8,
  },
  severityBadge: {
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 8,
  },
  severityText: {
    fontSize: 10,
    fontWeight: 'bold',
    textTransform: 'uppercase',
  },
  warningText: {
    fontSize: 16,
    flex: 1,
    lineHeight: 22,
    fontWeight: '600',
    marginBottom: 4,
  },
  timestamp: {
    fontSize: 12,
    color: '#6c757d',
    fontStyle: 'italic',
  },
  modalButton: {
    backgroundColor: '#007bff',
    paddingHorizontal: 32,
    paddingVertical: 14,
    borderRadius: 10,
    marginBottom: 16,
    shadowColor: '#007bff',
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.3,
    shadowRadius: 4,
    elevation: 4,
  },
  modalButtonText: {
    color: 'white',
    fontSize: 16,
    fontWeight: 'bold',
  },
  footerText: {
    fontSize: 12,
    color: '#6c757d',
    textAlign: 'center',
    fontStyle: 'italic',
  },
}); 