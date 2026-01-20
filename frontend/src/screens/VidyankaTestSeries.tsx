// src/screens/VidyankaTestSeries.tsx
import React, { useState, useEffect } from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
  Dimensions,
  useWindowDimensions,
  Modal,
  Platform,
} from 'react-native';
import { Ionicons, FontAwesome5, Feather } from '@expo/vector-icons';
import { NativeStackScreenProps } from '@react-navigation/native-stack';
import { useFocusEffect, useNavigation } from '@react-navigation/native';
import { RootStackParamList } from '../../App';
import GlassCard from '../components/GlassCard';
import { colors } from '../theme';
import AsyncStorage from '@react-native-async-storage/async-storage';
import UserDashboardLayout from '../components/UserDashboardLayout';
import type { NativeStackNavigationProp } from '@react-navigation/native-stack';

type Props = NativeStackScreenProps<RootStackParamList, 'VidyankaTestSeries'>;

interface Test {
  id: string;
  name: string;
  fullName: string;
  icon: keyof typeof Feather.glyphMap;
  available: boolean;
  color: string;
}

const VidyankaTestSeries: React.FC<Props> = ({ navigation }) => {
  const { width: windowWidth } = useWindowDimensions();
  const isMobile = windowWidth < 480;
  const [currentTime, setCurrentTime] = useState(new Date());
  const [notificationCount] = useState(3);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [infoTest, setInfoTest] = useState<Test | null>(null);
  const [attempted, setAttempted] = useState<{ [key: string]: boolean }>({});
  const [showAttempts, setShowAttempts] = useState<{ test: Test | null, visible: boolean }>({ test: null, visible: false });

  useEffect(() => {
    const timer = setInterval(() => {
      setCurrentTime(new Date());
    }, 60000);
    return () => clearInterval(timer);
  }, []);



  const formatTime = (date: Date) =>
    date.toLocaleTimeString('en-IN', {
      hour: '2-digit',
      minute: '2-digit',
      hour12: true,
    });

  const formatDate = (date: Date) =>
    date.toLocaleDateString('en-IN', {
      weekday: 'long',
      year: 'numeric',
      month: 'long',
      day: 'numeric',
    });

  const testSeries: Test[] = [
    { id: '1', name: 'MPSC', fullName: 'Maharashtra Public Service Commission', icon: 'file-text', available: true, color: '#4f46e5' },
    { id: '2', name: 'UPSC', fullName: 'Union Public Service Commission', icon: 'file-text', available: true, color: '#059669' },
    { id: '3', name: 'MHT-CET', fullName: 'Maharashtra Common Entrance Test', icon: 'file-text', available: false, color: '#dc2626' },
    { id: '4', name: 'NEET', fullName: 'National Eligibility cum Entrance Test', icon: 'file-text', available: true, color: '#7c3aed' },
    { id: '5', name: 'JEE', fullName: 'Joint Entrance Examination', icon: 'file-text', available: false, color: '#ea580c' },
    { id: '6', name: 'FMJE', fullName: 'Foreign Medical Graduate Examination', icon: 'file-text', available: false, color: '#0891b2' },
  ];

  // Sample questions (should match ExamScreen)
  const UPSC_QUESTIONS = [
    { id: '1', type: 'single', question: 'Who is known as the Father of the Indian Constitution?', options: ['Mahatma Gandhi', 'B. R. Ambedkar', 'Jawaharlal Nehru', 'Sardar Patel'], answer: 1 },
    { id: '2', type: 'multi', question: 'Which of the following are fundamental rights? (Select all that apply)', options: ['Right to Equality', 'Right to Vote', 'Right to Freedom', 'Right to Property'], answer: [0, 2] },
    { id: '3', type: 'tf', question: 'The President of India is elected for a term of 5 years.', answer: true },
    { id: '4', type: 'short', question: 'Name the river that is the longest in India.', answer: 'Ganga' },
  ];
  const MPSC_QUESTIONS = [
    { id: '1', type: 'single', question: 'Who was the first Chief Minister of Maharashtra?', options: ['Vasantrao Naik', 'Yashwantrao Chavan', 'Sharad Pawar', 'Shivajirao Patil'], answer: 1 },
    { id: '2', type: 'multi', question: 'Which of the following are districts in Maharashtra? (Select all that apply)', options: ['Aurangabad', 'Nagpur', 'Bhopal', 'Nashik'], answer: [0, 1, 3] },
    { id: '3', type: 'tf', question: 'Ajanta Caves are located in Aurangabad district.', answer: true },
    { id: '4', type: 'short', question: 'Which is the largest district in Maharashtra by area?', answer: 'Ahmednagar' },
  ];

  // Add NEET questions array
  const NEET_QUESTIONS = [
    {
      id: '1',
      type: 'single',
      question: "The characteristic distance at which quantum gravitational effects are significant, the Planck length, can be determined from a suitable combination of the fundamental physical constants G, h, and c. Which of the following correctly gives the Planck length?",
      options: ["Gh²³", "G²hc", "Gh²⁴", "Gh²⁵"],
      answer: 1
    },
    {
      id: '2',
      type: 'single',
      question: "What is the atomic number of carbon?",
      options: ["6", "7", "8", "5"],
      answer: 0
    },
    {
      id: '3',
      type: 'single',
      question: "Which law states that the pressure of a gas is inversely proportional to its volume at constant temperature?",
      options: ["Boyle's Law", "Charles' Law", "Avogadro's Law", "Dalton's Law"],
      answer: 0
    },
    {
      id: '4',
      type: 'single',
      question: "Who is known as the father of modern physics?",
      options: ["Isaac Newton", "Albert Einstein", "Niels Bohr", "Galileo Galilei"],
      answer: 1
    },
    {
      id: '5',
      type: 'single',
      question: "What is the SI unit of electric current?",
      options: ["Ampere", "Volt", "Ohm", "Tesla"],
      answer: 0
    },
    {
      id: '6',
      type: 'single',
      question: "What is the chemical symbol for gold?",
      options: ["Au", "Ag", "Pb", "Fe"],
      answer: 0
    },
    {
      id: '7',
      type: 'single',
      question: "Which element has the highest atomic number?",
      options: ["Uranium", "Neptunium", "Plutonium", "Oganesson"],
      answer: 3
    },
    {
      id: '8',
      type: 'single',
      question: "What is the speed of light in vacuum?",
      options: ["3 x 10⁸ m/s", "1.5 x 10⁸ m/s", "3 x 10¹⁰ m/s", "1 x 10⁸ m/s"],
      answer: 0
    },
    {
      id: '9',
      type: 'single',
      question: "Which gas is most abundant in the Earth's atmosphere?",
      options: ["Nitrogen", "Oxygen", "Argon", "Carbon dioxide"],
      answer: 0
    },
    {
      id: '10',
      type: 'single',
      question: "What is the formula for calculating kinetic energy?",
      options: ["KE = 1/2 mv²", "KE = mv²", "KE = 1/2 mgh", "KE = mgh"],
      answer: 0
    }
  ];

  const nav = useNavigation<NativeStackNavigationProp<RootStackParamList>>();

  useEffect(() => {
    const loadAttempts = async () => {
      try {
        const data = await AsyncStorage.getItem('examAttempts');
        if (data) {
          const arr = JSON.parse(data);
          const map: { [key: string]: boolean } = {};
          arr.forEach((a: any) => { if (a.examType) map[a.examType] = true; });
          setAttempted(map);
        }
      } catch (e) {}
    };
    loadAttempts();
  }, []);

  const handleTestSelect = async (test: Test) => {
    if (!test.available) return;
    setLoading(true);
    setError('');
    try {
      if (test.name === 'UPSC') {
        nav.navigate('UPSCMockTest');
      } else if (test.name === 'MPSC') {
        nav.navigate('MPSCMockTest');
      } else if (test.name === 'NEET') {
        nav.navigate('NEETMockTest');
      }
    } catch (e) {
      setError('Failed to start exam.');
    } finally {
      setLoading(false);
    }
  };



  return (
    <UserDashboardLayout title="Test Series" activeLabel="Test Series">
      <View style={styles.mainContent}>
        <GlassCard style={styles.glassCard}>
          <ScrollView contentContainerStyle={[
            styles.testGrid,
            isMobile && styles.testGridMobile
          ]}>
            {testSeries.map((test) => (
              <TouchableOpacity
                key={test.id}
                onPress={() => handleTestSelect(test)}
                style={[
                  styles.card,
                  !test.available && styles.cardDisabled,
                  isMobile && styles.cardMobile
                ]}
                activeOpacity={test.available ? 0.85 : 1}
                onLongPress={() => setInfoTest(test)}
              >
                <View style={styles.iconWrapper}>
                  <Feather name={test.icon} size={32} color={test.available ? test.color : '#9ca3af'} />
                  {!test.available && (
                    <Ionicons
                      name="lock-closed"
                      size={16}
                      color="#6b7280"
                      style={styles.lockIcon}
                    />
                  )}
                </View>
                <Text style={[styles.testName, !test.available && styles.disabledText]}>{test.name}</Text>
                <Text style={[styles.testFullName, !test.available && styles.disabledText]}>
                  {test.fullName}
                </Text>
                <View style={styles.statusRow}>
                  <Text style={test.available ? styles.statusAvailable : styles.statusSoon}>
                    {test.available ? 'Available' : 'Coming Soon'}
                  </Text>
                  {attempted[test.name] && <Text style={styles.attemptedBadge}>Attempted</Text>}
                </View>
                <TouchableOpacity style={styles.infoBtn} onPress={() => setInfoTest(test)}>
                  <Ionicons name="information-circle-outline" size={18} color="#4f46e5" />
                </TouchableOpacity>
                {test.available && (
                  <TouchableOpacity style={styles.attemptsBtn} onPress={() => setShowAttempts({ test, visible: true })}>
                    <Ionicons name="time-outline" size={16} color="#059669" />
                    <Text style={styles.attemptsBtnText}>Past Attempts</Text>
                  </TouchableOpacity>
                )}
              </TouchableOpacity>
            ))}
          </ScrollView>
        </GlassCard>
        {loading && <View style={styles.loadingOverlay}><Text style={styles.loadingText}>Loading...</Text></View>}
        {error ? <Text style={styles.errorText}>{error}</Text> : null}
      </View>
    </UserDashboardLayout>
  );
};

const styles = StyleSheet.create({
  container: { flex: 1, flexDirection: 'row', backgroundColor: colors.background, padding: 16 },
  mainContent: { flex: 1 },
  testGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    justifyContent: 'space-between',
  },
  testGridMobile: {
    flexDirection: 'column',
    flexWrap: 'nowrap',
    gap: 12,
  },
  card: {
    backgroundColor: '#fff',
    borderRadius: 12,
    padding: 16,
    width: '48%',
    alignItems: 'center',
    ...(Platform.OS === 'android' ? {
      elevation: 0,
      shadowColor: 'transparent',
      borderWidth: 0,
    } : {
      elevation: 2,
      borderColor: '#e5e7eb',
      borderWidth: 1,
    }),
    marginRight: 12,
    marginBottom: 12,
  },
  cardMobile: {
    width: '100%',
    marginRight: 0,
  },
  cardDisabled: {
    opacity: 0.5,
    backgroundColor: '#f1f5f9',
  },
  iconWrapper: {
    position: 'relative',
    marginBottom: 12,
  },
  lockIcon: {
    position: 'absolute',
    bottom: -6,
    right: -6,
    backgroundColor: '#fff',
    borderRadius: 8,
    padding: 2,
  },
  testName: {
    fontSize: 16,
    fontWeight: '600',
    color: '#1f2937',
    textAlign: 'center',
  },
  testFullName: {
    fontSize: 12,
    color: '#6b7280',
    textAlign: 'center',
    marginTop: 4,
    marginBottom: 8,
  },
  statusRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 8,
  },
  statusAvailable: {
    fontSize: 12,
    color: '#16a34a',
    backgroundColor: '#dcfce7',
    paddingHorizontal: 10,
    paddingVertical: 4,
    borderRadius: 20,
  },
  statusSoon: {
    fontSize: 12,
    color: '#6b7280',
    backgroundColor: '#f3f4f6',
    paddingHorizontal: 10,
    paddingVertical: 4,
    borderRadius: 20,
  },
  attemptedBadge: {
    fontSize: 12,
    color: '#dc2626',
    backgroundColor: '#fef2f2',
    paddingHorizontal: 10,
    paddingVertical: 4,
    borderRadius: 20,
  },
  infoBtn: {
    position: 'absolute',
    top: 8,
    right: 8,
  },
  attemptsBtn: {
    position: 'absolute',
    top: 8,
    right: 8,
    backgroundColor: '#059669',
    borderRadius: 8,
    padding: 4,
  },
  attemptsBtnText: {
    fontSize: 12,
    color: '#fff',
    fontWeight: 'bold',
  },
  glassCard: { width: '100%', maxWidth: 700, alignSelf: 'center', marginTop: 24, padding: 0 },
  loadingOverlay: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
  },
  loadingText: {
    fontSize: 18,
    color: '#fff',
    fontWeight: 'bold',
  },
  errorText: {
    fontSize: 16,
    color: '#dc2626',
    textAlign: 'center',
    marginTop: 20,
  },
  disabledText: {
    color: '#9ca3af',
  },
});

export default VidyankaTestSeries;