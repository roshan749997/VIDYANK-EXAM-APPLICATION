// src/screens/ExamHistory.tsx
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
import { Ionicons, FontAwesome5, MaterialCommunityIcons } from '@expo/vector-icons';
import { NativeStackScreenProps } from '@react-navigation/native-stack';
import { useFocusEffect } from '@react-navigation/native';
import { RootStackParamList } from '../../App';
import GlassCard from '../components/GlassCard';
import { colors } from '../theme';
import GlassSidebar from '../components/GlassSidebar';
import DashboardHeader from './DashboardHeader';
import BlankHeader from './BlankHeader';
import { getUserSidebarItems } from './userSidebarItems';
import UserDashboardLayout from './UserDashboardLayout';
import { useUser } from '../context/UserContext';
import api from '../services/api';

type Props = NativeStackScreenProps<RootStackParamList, 'ExamHistory'>;

interface ExamRecord {
  id: string;
  testName: string;
  category: string;
  score: number;
  totalQuestions: number;
  correctAnswers: number;
  dateAttempted: string;
  timeTaken: string;
  status: 'completed' | 'incomplete';
}

// ================= MOBILE VIEW COMPONENT =================
function MobileExamHistory({ examHistory, getScoreColor, getCategoryColor, navigation }: any) {
  return (
    <ScrollView style={{ flex: 1, width: '100%' }} contentContainerStyle={{ paddingBottom: 80, flexGrow: 1 }} showsVerticalScrollIndicator={false}>
      <View style={{ width: '100%' }}>
        {/* Stats Card */}
        <GlassCard style={[styles.statsCard, { padding: 12, marginTop: 24, width: '100%', borderRadius: 16, borderLeftWidth: 1, borderRightWidth: 1, borderColor: '#e5e7eb' }] }>
          <View style={styles.statsHeader}>
            <Text style={[styles.statsTitle, { fontSize: 16 }]}>Performance Overview</Text>
            <Ionicons name="analytics-outline" size={20} color="#4f46e5" />
          </View>
          <View style={{ flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', width: '100%' }}>
            {/* Completed Tests */}
            <View style={{ flex: 1, alignItems: 'center' }}>
              <View style={styles.statIconContainer}>
                <FontAwesome5 name="check-circle" size={22} color="#16a34a" />
              </View>
              <Text style={[styles.statNumber, { fontSize: 20 }]}> 
                {examHistory.filter((exam: ExamRecord) => exam.status === 'completed').length}
              </Text>
              <Text style={styles.statLabel}>Completed</Text>
            </View>
            {/* Incomplete */}
            <View style={{ flex: 1, alignItems: 'center' }}>
              <View style={styles.statIconContainer}>
                <FontAwesome5 name="clock" size={22} color="#f97316" />
              </View>
              <Text style={[styles.statNumber, { fontSize: 20 }]}> 
                {examHistory.filter((exam: ExamRecord) => exam.status === 'incomplete').length}
              </Text>
              <Text style={styles.statLabel}>Incomplete</Text>
            </View>
            {/* Average Score */}
            <View style={{ flex: 1, alignItems: 'center' }}>
              <View style={styles.statIconContainer}>
                <FontAwesome5 name="chart-line" size={22} color="#4f46e5" />
              </View>
              <Text style={[styles.statNumber, { fontSize: 20 }]}> 
                {examHistory.length > 0 ? Math.round(examHistory.reduce((acc: number, exam: ExamRecord) => acc + exam.score, 0) / examHistory.length) : 0}%
              </Text>
              <Text style={styles.statLabel}>Avg Score</Text>
            </View>
          </View>
        </GlassCard>

        <View style={[styles.examListHeader, { paddingHorizontal: 4 } ]}>
          <Text style={[styles.examListTitle, { fontSize: 16 }]}>Recent Examinations</Text>
          <Text style={styles.examListCount}>{examHistory.length} exams</Text>
        </View>

        {examHistory.map((exam: ExamRecord, index: number) => (
          <GlassCard
            key={exam.id}
            style={[
              styles.examCard,
              { marginTop: index === 0 ? 16 : 12 },
              { padding: 0, marginHorizontal: 0 },
              { width: '100%', alignSelf: 'center', borderLeftWidth: 1, borderRightWidth: 1, borderColor: '#e5e7eb', borderRadius: 12 },
            ]}
          >
            <TouchableOpacity style={[styles.examCardContent, { padding: 12 }]} activeOpacity={0.7}>
              <View style={styles.examHeader}>
                <View style={styles.examTitleContainer}>
                  <Text style={[styles.examTitle, { fontSize: 14, marginBottom: 8 }]} numberOfLines={2}>{exam.testName}</Text>
                  <View style={styles.examBadgeContainer}>
                    <View style={[styles.categoryBadge, { backgroundColor: getCategoryColor(exam.category) }]}>
                      <Text style={[styles.categoryText, { fontSize: 11 }]}>{exam.category}</Text>
                    </View>
                    <View style={[styles.statusBadge, { 
                      backgroundColor: exam.status === 'completed' ? '#f0fdf4' : '#fef3c7',
                      borderColor: exam.status === 'completed' ? '#16a34a' : '#f59e0b'
                    }] }>
                      <Ionicons
                        name={exam.status === 'completed' ? 'checkmark-circle' : 'time-outline'}
                        size={14}
                        color={exam.status === 'completed' ? '#16a34a' : '#f59e0b'}
                      />
                      <Text style={[styles.statusText, { color: exam.status === 'completed' ? '#16a34a' : '#f59e0b' }, { fontSize: 11 } ]}>
                        {exam.status === 'completed' ? 'Done' : 'Pending'}
                      </Text>
                    </View>
                  </View>
                </View>
              </View>
              <View style={[styles.examBody, { flexDirection: 'column', gap: 8 } ]}>
                <View style={[styles.scoreSection, { marginBottom: 8 } ]}>
                  <View style={styles.scoreDisplay}>
                    <Text style={[styles.scoreText, { color: getScoreColor(exam.score) }, { fontSize: 18 } ]}>
                      {exam.score}%
                    </Text>
                    <View style={styles.scoreBar}>
                      <View style={[styles.scoreProgress, { 
                        width: `${exam.score}%`,
                        backgroundColor: getScoreColor(exam.score)
                      }]} />
                    </View>
                  </View>
                  <View style={styles.questionsInfo}>
                    <Text style={[styles.questionsText, { fontSize: 13 } ]}>
                      {exam.correctAnswers}/{exam.totalQuestions}
                    </Text>
                    <Text style={[styles.questionsLabel, { fontSize: 11 } ]}>Correct</Text>
                  </View>
                </View>
                <View style={[styles.examFooter, { flexDirection: 'column', alignItems: 'flex-start', gap: 6 } ]}>
                  <View style={styles.metaInfo}>
                    <View style={styles.metaItem}>
                      <Ionicons name="calendar-outline" size={14} color="#6b7280" />
                      <Text style={[styles.metaText, { fontSize: 12 } ]}>{exam.dateAttempted}</Text>
                    </View>
                    <View style={styles.metaItem}>
                      <Ionicons name="time-outline" size={14} color="#6b7280" />
                      <Text style={[styles.metaText, { fontSize: 12 } ]}>{exam.timeTaken}</Text>
                    </View>
                  </View>
                  <TouchableOpacity style={[styles.viewDetailsButton, { paddingVertical: 4, paddingHorizontal: 8 } ]} activeOpacity={0.7}>
                    <Text style={[styles.viewDetailsText, { fontSize: 13 } ]}>View Details</Text>
                    <Ionicons name="chevron-forward" size={16} color="#4f46e5" />
                  </TouchableOpacity>
                </View>
              </View>
            </TouchableOpacity>
          </GlassCard>
        ))}
      </View>
    </ScrollView>
  );
}

// ================= DESKTOP VIEW COMPONENT =================
function DesktopExamHistory({ examHistory, getScoreColor, getCategoryColor, navigation, windowWidth }: any) {
  // Determine number of columns based on screen width
  const getColumnCount = () => {
    if (windowWidth >= 1400) return 3;
    if (windowWidth >= 1024) return 2;
    return 1;
  };

  const columnCount = getColumnCount();
  
  // Helper to chunk exams into groups based on column count
  const chunkedExams: ExamRecord[][] = [];
  for (let i = 0; i < examHistory.length; i += columnCount) {
    chunkedExams.push(examHistory.slice(i, i + columnCount));
  }

  return (
    <ScrollView 
      style={{ flex: 1, width: '100%' }} 
      contentContainerStyle={{ 
        paddingBottom: 80, 
        alignItems: 'center', 
        flexGrow: 1,
        paddingHorizontal: windowWidth >= 1400 ? 40 : 20
      }} 
      showsVerticalScrollIndicator={false}
    >
      <View style={{ 
        width: '100%', 
        maxWidth: windowWidth >= 1400 ? 1400 : windowWidth >= 1024 ? 1200 : 800,
        alignSelf: 'center' 
      }}>
        {/* Stats Card */}
        <GlassCard style={[
          styles.statsCard, 
          { 
            padding: windowWidth >= 1400 ? 40 : windowWidth >= 1200 ? 36 : windowWidth >= 1024 ? 32 : windowWidth >= 768 ? 28 : 24, 
            marginTop: 24,
            width: '100%',
            minWidth: windowWidth >= 1400 ? 1200 : windowWidth >= 1200 ? 1000 : windowWidth >= 1024 ? 800 : windowWidth >= 768 ? 600 : 400,
            maxWidth: '100%'
          }
        ]}>
          <View style={styles.statsHeader}>
            <Text style={[
              styles.statsTitle, 
              { 
                fontSize: windowWidth >= 1400 ? 28 : windowWidth >= 1200 ? 26 : windowWidth >= 1024 ? 24 : windowWidth >= 768 ? 22 : 20, 
                fontWeight: '700', 
                color: '#1f2937' 
              }
            ]}>Performance Overview</Text>
            <Ionicons name="analytics-outline" size={windowWidth >= 1400 ? 32 : windowWidth >= 1200 ? 30 : windowWidth >= 1024 ? 28 : windowWidth >= 768 ? 26 : 24} color="#4f46e5" />
          </View>
          <View style={{ 
            flexDirection: 'row', 
            justifyContent: 'space-between', 
            alignItems: 'center', 
            width: '100%',
            gap: windowWidth >= 1400 ? 48 : windowWidth >= 1200 ? 40 : windowWidth >= 1024 ? 32 : windowWidth >= 768 ? 24 : 16,
            paddingHorizontal: windowWidth >= 1400 ? 32 : windowWidth >= 1200 ? 28 : windowWidth >= 1024 ? 24 : windowWidth >= 768 ? 20 : 16
          }}>
            {/* Completed Tests */}
            <View style={{ 
              flex: 1, 
              alignItems: 'center',
              minWidth: windowWidth >= 1400 ? 300 : windowWidth >= 1200 ? 280 : windowWidth >= 1024 ? 250 : windowWidth >= 768 ? 200 : 150
            }}>
              <View style={styles.statIconContainer}>
                <FontAwesome5 name="check-circle" size={windowWidth >= 1400 ? 32 : windowWidth >= 1200 ? 30 : windowWidth >= 1024 ? 28 : windowWidth >= 768 ? 26 : 24} color="#16a34a" />
              </View>
              <Text style={[
                styles.statNumber, 
                { 
                  fontSize: windowWidth >= 1400 ? 42 : windowWidth >= 1200 ? 38 : windowWidth >= 1024 ? 36 : windowWidth >= 768 ? 32 : 30, 
                  fontWeight: 'bold', 
                  color: '#1f2937', 
                  marginBottom: 6 
                }
              ]}>
                {examHistory.filter((exam: ExamRecord) => exam.status === 'completed').length}
              </Text>
              <Text style={[
                styles.statLabel, 
                { 
                  fontSize: windowWidth >= 1400 ? 18 : windowWidth >= 1200 ? 17 : windowWidth >= 1024 ? 16 : windowWidth >= 768 ? 15 : 14, 
                  color: '#6b7280', 
                  fontWeight: '500', 
                  textAlign: 'center' 
                }
              ]}>Completed</Text>
            </View>
            {/* Incomplete */}
            <View style={{ 
              flex: 1, 
              alignItems: 'center',
              minWidth: windowWidth >= 1400 ? 300 : windowWidth >= 1200 ? 280 : windowWidth >= 1024 ? 250 : windowWidth >= 768 ? 200 : 150
            }}>
              <View style={styles.statIconContainer}>
                <FontAwesome5 name="clock" size={windowWidth >= 1400 ? 32 : windowWidth >= 1200 ? 30 : windowWidth >= 1024 ? 28 : windowWidth >= 768 ? 26 : 24} color="#f97316" />
              </View>
              <Text style={[
                styles.statNumber, 
                { 
                  fontSize: windowWidth >= 1400 ? 42 : windowWidth >= 1200 ? 38 : windowWidth >= 1024 ? 36 : windowWidth >= 768 ? 32 : 30, 
                  fontWeight: 'bold', 
                  color: '#1f2937', 
                  marginBottom: 6 
                }
              ]}>
                {examHistory.filter((exam: ExamRecord) => exam.status === 'incomplete').length}
              </Text>
              <Text style={[
                styles.statLabel, 
                { 
                  fontSize: windowWidth >= 1400 ? 18 : windowWidth >= 1200 ? 17 : windowWidth >= 1024 ? 16 : windowWidth >= 768 ? 15 : 14, 
                  color: '#6b7280', 
                  fontWeight: '500', 
                  textAlign: 'center' 
                }
              ]}>Incomplete</Text>
            </View>
            {/* Average Score */}
            <View style={{ 
              flex: 1, 
              alignItems: 'center',
              minWidth: windowWidth >= 1400 ? 300 : windowWidth >= 1200 ? 280 : windowWidth >= 1024 ? 250 : windowWidth >= 768 ? 200 : 150
            }}>
              <View style={styles.statIconContainer}>
                <FontAwesome5 name="chart-line" size={windowWidth >= 1400 ? 32 : windowWidth >= 1200 ? 30 : windowWidth >= 1024 ? 28 : windowWidth >= 768 ? 26 : 24} color="#4f46e5" />
              </View>
              <Text style={[
                styles.statNumber, 
                { 
                  fontSize: windowWidth >= 1400 ? 42 : windowWidth >= 1200 ? 38 : windowWidth >= 1024 ? 36 : windowWidth >= 768 ? 32 : 30, 
                  fontWeight: 'bold', 
                  color: '#1f2937', 
                  marginBottom: 6 
                }
              ]}>
                {examHistory.length > 0 ? Math.round(examHistory.reduce((acc: number, exam: ExamRecord) => acc + exam.score, 0) / examHistory.length) : 0}%
              </Text>
              <Text style={[
                styles.statLabel, 
                { 
                  fontSize: windowWidth >= 1400 ? 18 : windowWidth >= 1200 ? 17 : windowWidth >= 1024 ? 16 : windowWidth >= 768 ? 15 : 14, 
                  color: '#6b7280', 
                  fontWeight: '500', 
                  textAlign: 'center' 
                }
              ]}>Avg Score</Text>
            </View>
          </View>
        </GlassCard>

        <View style={[
          styles.examListHeader, 
          { 
            flexDirection: 'row', 
            justifyContent: 'space-between', 
            alignItems: 'center', 
            marginBottom: 8,
            marginTop: windowWidth >= 1400 ? 32 : 24
          }
        ]}>
          <Text style={[
            styles.examListTitle, 
            { 
              fontSize: windowWidth >= 1400 ? 20 : 16, 
              fontWeight: '700', 
              color: '#1f2937' 
            }
          ]}>Recent Examinations</Text>
          <Text style={[
            styles.examListCount, 
            { 
              fontSize: windowWidth >= 1400 ? 16 : 13, 
              color: '#6b7280', 
              fontWeight: '500' 
            }
          ]}>{examHistory.length} exams</Text>
        </View>

        {/* Render cards in responsive grid */}
        {chunkedExams.map((row: ExamRecord[], rowIdx: number) => (
          <View 
            key={rowIdx} 
            style={{ 
              flexDirection: 'row', 
              justifyContent: 'space-between', 
              marginTop: rowIdx === 0 ? (windowWidth >= 1400 ? 32 : 24) : (windowWidth >= 1400 ? 24 : 16), 
              gap: windowWidth >= 1400 ? 32 : 24 
            }}
          >
            {row.map((exam: ExamRecord, colIdx: number) => (
              <GlassCard
                key={exam.id}
                style={{ 
                  flex: 1, 
                  minHeight: windowWidth >= 1400 ? 280 : 220, 
                  minWidth: 0, 
                  maxWidth: `${100 / columnCount}%`, 
                  ...styles.examCard 
                }}
              >
                <TouchableOpacity style={[
                  styles.examCardContent, 
                  { 
                    padding: windowWidth >= 1400 ? 28 : 20 
                  }
                ]} activeOpacity={0.7}>
                  <View style={styles.examHeader}>
                    <View style={styles.examTitleContainer}>
                      <Text style={[
                        styles.examTitle, 
                        { 
                          fontSize: windowWidth >= 1400 ? 18 : 15, 
                          fontWeight: '700', 
                          color: '#1f2937', 
                          marginBottom: 12, 
                          lineHeight: windowWidth >= 1400 ? 24 : 20 
                        }
                      ]} numberOfLines={2}>{exam.testName}</Text>
                      <View style={styles.examBadgeContainer}>
                        <View style={[styles.categoryBadge, { backgroundColor: getCategoryColor(exam.category) }]}> 
                          <Text style={[
                            styles.categoryText, 
                            { 
                              fontSize: windowWidth >= 1400 ? 12 : 11, 
                              color: '#fff', 
                              fontWeight: '600', 
                              letterSpacing: 0.5 
                            }
                          ]}>{exam.category}</Text>
                        </View>
                        <View style={[
                          styles.statusBadge, 
                          { 
                            flexDirection: 'row', 
                            alignItems: 'center', 
                            paddingHorizontal: windowWidth >= 1400 ? 10 : 8, 
                            paddingVertical: windowWidth >= 1400 ? 5 : 4, 
                            borderRadius: 16, 
                            borderWidth: 1, 
                            gap: 4,
                            backgroundColor: exam.status === 'completed' ? '#f0fdf4' : '#fef3c7',
                            borderColor: exam.status === 'completed' ? '#16a34a' : '#f59e0b'
                          }
                        ]}>
                          <Ionicons
                            name={exam.status === 'completed' ? 'checkmark-circle' : 'time-outline'}
                            size={windowWidth >= 1400 ? 14 : 12}
                            color={exam.status === 'completed' ? '#16a34a' : '#f59e0b'}
                          />
                          <Text style={[
                            styles.statusText, 
                            { 
                              fontSize: windowWidth >= 1400 ? 11 : 10, 
                              fontWeight: '600' 
                            }
                          ]}> 
                            {exam.status === 'completed' ? 'Done' : 'Pending'}
                          </Text>
                        </View>
                      </View>
                    </View>
                  </View>
                  <View style={[
                    styles.examBody, 
                    { 
                      gap: windowWidth >= 1400 ? 20 : 16 
                    }
                  ]}>
                    <View style={[
                      styles.scoreSection, 
                      { 
                        flexDirection: 'row', 
                        justifyContent: 'space-between', 
                        alignItems: 'center', 
                        backgroundColor: 'rgba(249, 250, 251, 0.8)', 
                        padding: windowWidth >= 1400 ? 20 : 16, 
                        borderRadius: 12, 
                        borderWidth: 1, 
                        borderColor: 'rgba(229, 231, 235, 0.5)' 
                      }
                    ]}> 
                      <View style={styles.scoreDisplay}>
                        <Text style={[
                          styles.scoreText, 
                          { 
                            color: getScoreColor(exam.score), 
                            fontSize: windowWidth >= 1400 ? 28 : 24, 
                            fontWeight: 'bold', 
                            marginBottom: 8 
                          }
                        ]}> 
                          {exam.score}%
                        </Text>
                        <View style={styles.scoreBar}>
                          <View style={[
                            styles.scoreProgress, 
                            { 
                              height: '100%',
                              borderRadius: 3,
                              width: `${exam.score}%`,
                              backgroundColor: getScoreColor(exam.score)
                            }
                          ]} />
                        </View>
                      </View>
                      <View style={styles.questionsInfo}>
                        <Text style={[
                          styles.questionsText, 
                          { 
                            fontSize: windowWidth >= 1400 ? 20 : 18, 
                            fontWeight: 'bold', 
                            color: '#1f2937' 
                          }
                        ]}> 
                          {exam.correctAnswers}/{exam.totalQuestions}
                        </Text>
                        <Text style={[
                          styles.questionsLabel, 
                          { 
                            fontSize: windowWidth >= 1400 ? 12 : 11, 
                            color: '#6b7280', 
                            fontWeight: '500', 
                            marginTop: 2 
                          }
                        ]}>Correct</Text>
                      </View>
                    </View>
                    <View style={[
                      styles.examFooter, 
                      { 
                        flexDirection: 'row', 
                        justifyContent: 'space-between', 
                        alignItems: 'center', 
                        paddingTop: 12, 
                        borderTopWidth: 1, 
                        borderTopColor: 'rgba(229, 231, 235, 0.5)' 
                      }
                    ]}>
                      <View style={styles.metaInfo}>
                        <View style={styles.metaItem}>
                          <Ionicons name="calendar-outline" size={windowWidth >= 1400 ? 14 : 12} color="#6b7280" />
                          <Text style={[
                            styles.metaText, 
                            { 
                              fontSize: windowWidth >= 1400 ? 13 : 12, 
                              color: '#6b7280', 
                              fontWeight: '500' 
                            }
                          ]}>{exam.dateAttempted}</Text>
                        </View>
                        <View style={styles.metaItem}>
                          <Ionicons name="time-outline" size={windowWidth >= 1400 ? 14 : 12} color="#6b7280" />
                          <Text style={[
                            styles.metaText, 
                            { 
                              fontSize: windowWidth >= 1400 ? 13 : 12, 
                              color: '#6b7280', 
                              fontWeight: '500' 
                            }
                          ]}>{exam.timeTaken}</Text>
                        </View>
                      </View>
                      <TouchableOpacity style={[
                        styles.viewDetailsButton, 
                        { 
                          flexDirection: 'row', 
                          alignItems: 'center', 
                          backgroundColor: 'rgba(79, 70, 229, 0.1)', 
                          paddingHorizontal: windowWidth >= 1400 ? 14 : 12, 
                          paddingVertical: windowWidth >= 1400 ? 8 : 6, 
                          borderRadius: 20, 
                          gap: 4 
                        }
                      ]} activeOpacity={0.7}>
                        <Text style={[
                          styles.viewDetailsText, 
                          { 
                            fontSize: windowWidth >= 1400 ? 13 : 12, 
                            color: '#4f46e5', 
                            fontWeight: '600' 
                          }
                        ]}>View Details</Text>
                        <Ionicons name="chevron-forward" size={windowWidth >= 1400 ? 16 : 14} color="#4f46e5" />
                      </TouchableOpacity>
                    </View>
                  </View>
                </TouchableOpacity>
              </GlassCard>
            ))}
            {/* Add spacers for incomplete rows */}
            {row.length < columnCount && Array.from({ length: columnCount - row.length }).map((_, idx) => (
              <View key={`spacer-${idx}`} style={{ flex: 1, minWidth: 0, maxWidth: `${100 / columnCount}%` }} />
            ))}
          </View>
        ))}
      </View>
    </ScrollView>
  );
}

// ================= MAIN SCREEN SELECTOR =================
const ExamHistory: React.FC<Props> = ({ navigation }) => {
  const { width: windowWidth } = useWindowDimensions();
  const isMobile = windowWidth < 768;
  const isTablet = windowWidth >= 768 && windowWidth < 1024;
  const isDesktop = windowWidth >= 1024;
  const [sidebarCollapsed, setSidebarCollapsed] = useState(true);
  const [currentTime, setCurrentTime] = useState(new Date());

  useEffect(() => {
    const timer = setInterval(() => {
      setCurrentTime(new Date());
    }, 60000);
    return () => clearInterval(timer);
  }, []);

  useFocusEffect(
    React.useCallback(() => {
      setSidebarCollapsed(isMobile);
    }, [isMobile])
  );

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

  const { user } = useUser();
  const [examHistory, setExamHistory] = useState<ExamRecord[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const loadExamHistory = async () => {
      if (!user) {
        setLoading(false);
        return;
      }

      try {
        // Fetch from backend API
        const response = await api.get('/exam-results');
        if (response.data && response.data.length > 0) {
          const formattedHistory: ExamRecord[] = response.data.map((result: any) => ({
            id: result._id || result.id,
            testName: result.examTitle || 'Untitled Exam',
            category: result.category || 'General',
            score: result.score || 0,
            totalQuestions: result.totalQuestions || 0,
            correctAnswers: result.correctAnswers || 0,
            dateAttempted: result.createdAt ? new Date(result.createdAt).toISOString().split('T')[0] : new Date().toISOString().split('T')[0],
            timeTaken: result.timeTaken || '0h 0m',
            status: result.status || 'incomplete',
          }));
          setExamHistory(formattedHistory);
        } else {
          setExamHistory([]);
        }
      } catch (error) {
        console.error('Error loading exam history:', error);
        setExamHistory([]);
      } finally {
        setLoading(false);
      }
    };

    loadExamHistory();
  }, [user]);

  const getScoreColor = (score: number) => {
    if (score >= 80) return '#16a34a';
    if (score >= 60) return '#eab308';
    if (score >= 40) return '#f97316';
    return '#dc2626';
  };

  const getScoreGradient = (score: number) => {
    if (score >= 80) return ['#16a34a', '#22c55e'];
    if (score >= 60) return ['#eab308', '#fbbf24'];
    if (score >= 40) return ['#f97316', '#fb923c'];
    return ['#dc2626', '#ef4444'];
  };

  const getCategoryColor = (category: string) => {
    switch (category) {
      case 'MPSC': return '#4f46e5';
      case 'UPSC': return '#059669';
      default: return '#6b7280';
    }
  };

  const getCategoryGradient = (category: string) => {
    switch (category) {
      case 'MPSC': return ['#4f46e5', '#6366f1'];
      case 'UPSC': return ['#059669', '#10b981'];
      default: return ['#6b7280', '#9ca3af'];
    }
  };

  if (loading) {
    return (
      <UserDashboardLayout title="Exam History" activeLabel="Exam History">
        <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center', padding: 20 }}>
          <Text style={{ fontSize: 16, color: '#6b7280' }}>Loading your exam history...</Text>
        </View>
      </UserDashboardLayout>
    );
  }

  return (
    <UserDashboardLayout title={`${user?.firstName || 'Your'} Exam History`} activeLabel="Exam History">
      {examHistory.length === 0 ? (
        <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center', padding: 40 }}>
          <Text style={{ fontSize: 20, fontWeight: '600', color: '#1f2937', marginBottom: 8 }}>
            No Exam History Yet
          </Text>
          <Text style={{ fontSize: 14, color: '#6b7280', textAlign: 'center', marginBottom: 24 }}>
            {user?.firstName ? `${user.firstName}, ` : ''}You haven't taken any exams yet. Start your first exam to see your history here!
          </Text>
        </View>
      ) : (
        <>
          {isMobile ? (
            <MobileExamHistory examHistory={examHistory} getScoreColor={getScoreColor} getCategoryColor={getCategoryColor} navigation={navigation} />
          ) : (
            <DesktopExamHistory examHistory={examHistory} getScoreColor={getScoreColor} getCategoryColor={getCategoryColor} navigation={navigation} windowWidth={windowWidth} />
          )}
        </>
      )}
    </UserDashboardLayout>
  );
};

const styles = StyleSheet.create({
  container: { 
    flex: 1, 
    backgroundColor: colors.background, 
    flexDirection: 'row',
    padding: 16,
  },
  mainContent: { 
    flex: 1,
  },
  scrollView: {
    flex: 1,
  },
  historyContainer: {
    paddingBottom: 32,
  },
  statsCard: {
    padding: 20,
    marginBottom: 24,
  },
  statsHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 20,
  },
  statsTitle: {
    fontSize: 18,
    fontWeight: '700',
    color: '#1f2937',
  },
  statsContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
  },
  statCard: {
    backgroundColor: '#fff',
    borderRadius: 16,
    padding: 18,
    flex: 1,
    alignItems: 'center',
    // Remove shadow/elevation on Android to avoid black border
    ...(Platform.OS === 'android' ? {
      elevation: 0,
      shadowColor: 'transparent',
      borderWidth: 0,
    } : {
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.08,
    shadowRadius: 12,
    elevation: 4,
    borderWidth: 1,
    borderColor: 'rgba(255, 255, 255, 0.2)',
    }),
  },
  statCardMiddle: {
    marginHorizontal: 8,
  },
  statIconContainer: {
    width: 48,
    height: 48,
    borderRadius: 24,
    backgroundColor: 'rgba(79, 70, 229, 0.1)',
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: 12,
  },
  statNumber: {
    fontSize: 28,
    fontWeight: 'bold',
    color: '#1f2937',
    marginBottom: 4,
  },
  statLabel: {
    fontSize: 13,
    color: '#6b7280',
    fontWeight: '500',
    textAlign: 'center',
  },
  examListHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 8,
  },
  examListTitle: {
    fontSize: 18,
    fontWeight: '700',
    color: '#1f2937',
  },
  examListCount: {
    fontSize: 14,
    color: '#6b7280',
    fontWeight: '500',
  },
  examCard: {
    marginBottom: 12,
    padding: 0,
    overflow: 'hidden',
    ...(Platform.OS === 'android' ? {
      elevation: 0,
      shadowColor: 'transparent',
      borderWidth: 0,
    } : {
      shadowColor: '#000',
      shadowOffset: { width: 0, height: 4 },
      shadowOpacity: 0.08,
      shadowRadius: 12,
      elevation: 4,
      borderWidth: 1,
      borderColor: 'rgba(255, 255, 255, 0.2)',
    }),
  },
  examCardContent: {
    padding: 20,
  },
  examHeader: {
    marginBottom: 16,
  },
  examTitleContainer: {
    flex: 1,
  },
  examTitle: {
    fontSize: 16,
    fontWeight: '700',
    color: '#1f2937',
    marginBottom: 12,
    lineHeight: 22,
  },
  examBadgeContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
  },
  categoryBadge: {
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 20,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 2,
  },
  categoryText: {
    fontSize: 12,
    color: '#fff',
    fontWeight: '600',
    letterSpacing: 0.5,
  },
  statusBadge: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 10,
    paddingVertical: 5,
    borderRadius: 16,
    borderWidth: 1,
    gap: 4,
  },
  statusText: {
    fontSize: 11,
    fontWeight: '600',
  },
  examBody: {
    gap: 16,
  },
  scoreSection: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    backgroundColor: 'rgba(249, 250, 251, 0.8)',
    padding: 16,
    borderRadius: 12,
    borderWidth: 1,
    borderColor: 'rgba(229, 231, 235, 0.5)',
  },
  scoreDisplay: {
    flex: 1,
  },
  scoreText: {
    fontSize: 28,
    fontWeight: 'bold',
    marginBottom: 8,
  },
  scoreBar: {
    height: 6,
    backgroundColor: '#e5e7eb',
    borderRadius: 3,
    overflow: 'hidden',
    width: '100%',
  },
  scoreProgress: {
    height: '100%',
    borderRadius: 3,
  },
  questionsInfo: {
    alignItems: 'center',
    marginLeft: 16,
  },
  questionsText: {
    fontSize: 20,
    fontWeight: 'bold',
    color: '#1f2937',
  },
  questionsLabel: {
    fontSize: 12,
    color: '#6b7280',
    fontWeight: '500',
    marginTop: 2,
  },
  examFooter: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingTop: 12,
    borderTopWidth: 1,
    borderTopColor: 'rgba(229, 231, 235, 0.5)',
  },
  metaInfo: {
    flex: 1,
  },
  metaItem: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 6,
    gap: 6,
  },
  metaText: {
    fontSize: 13,
    color: '#6b7280',
    fontWeight: '500',
  },
  viewDetailsButton: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: 'rgba(79, 70, 229, 0.1)',
    paddingHorizontal: 12,
    paddingVertical: 8,
    borderRadius: 20,
    gap: 4,
  },
  viewDetailsText: {
    fontSize: 13,
    color: '#4f46e5',
    fontWeight: '600',
  },
});

export default ExamHistory;