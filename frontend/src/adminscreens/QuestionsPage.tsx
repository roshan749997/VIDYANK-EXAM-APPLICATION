import React, { useState, useEffect } from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
  TextInput,
  Alert,
  ActivityIndicator,
  Dimensions,
  BackHandler,
  FlatList,
  useWindowDimensions,
} from 'react-native';
import { useNavigation, useFocusEffect } from '@react-navigation/native';
import { Ionicons } from '@expo/vector-icons';
import GlassCard from '../components/GlassCard';
import GlassButton from '../components/GlassButton';
import { getAllExams } from '../utils/multiTenantUtils';
import { colors } from '../theme';
import AdminLayout from './AdminLayout';

const { width } = Dimensions.get('window');

interface Exam {
  id: string;
  title: string;
  subject: string;
  difficulty: 'Easy' | 'Medium' | 'Hard';
  duration: number;
  questions: number;
  status: 'Active' | 'Draft' | 'Archived';
  createdAt: string;
  updatedAt: string;
}

const QuestionsPage: React.FC = () => {
  const navigation = useNavigation();
  const { width: windowWidth } = useWindowDimensions();
  useFocusEffect(
    React.useCallback(() => {
      const onBackPress = () => {
        (navigation as any).navigate('AdminDashboard');
        return true;
      };
      const subscription = BackHandler.addEventListener('hardwareBackPress', onBackPress);
      return () => subscription.remove();
    }, [navigation])
  );
  const [exams, setExams] = useState<Exam[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState('');
  const [filterStatus, setFilterStatus] = useState<'All' | 'Active' | 'Draft' | 'Archived'>('All');

  useEffect(() => {
    loadExams();
  }, []);

  const loadExams = async () => {
    setLoading(true);
    try {
      const allExams = await getAllExams();
      setExams(allExams);
    } catch (error) {
      console.error('Error loading exams:', error);
      Alert.alert('Error', 'Failed to load exams.');
    } finally {
      setLoading(false);
    }
  };

  const filteredExams = exams.filter(exam => {
    const title = (exam.title || '').toLowerCase();
    const subject = (exam.subject || '').toLowerCase();
    const matchesSearch = title.includes(searchQuery.toLowerCase()) ||
                         subject.includes(searchQuery.toLowerCase());
    const matchesStatus = filterStatus === 'All' || exam.status === filterStatus;
    return matchesSearch && matchesStatus;
  });

  const handleManageQuestions = (examId: string) => {
    (navigation as any).navigate('ManageQuestions', { examId });
  };

  const handleCreateNewExam = () => {
    // Navigate back to dashboard and open create exam modal
    navigation.goBack();
    // You might want to trigger the create exam modal from here
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'Active': return '#10b981';
      case 'Draft': return '#f59e0b';
      case 'Archived': return '#6b7280';
      default: return '#6b7280';
    }
  };

  const getDifficultyColor = (difficulty: string) => {
    switch (difficulty) {
      case 'Easy': return '#10b981';
      case 'Medium': return '#f59e0b';
      case 'Hard': return '#ef4444';
      default: return '#6b7280';
    }
  };

  const formatDate = (dateString: string) => {
    try {
      return new Date(dateString).toLocaleDateString('en-US', {
        year: 'numeric',
        month: 'short',
        day: 'numeric',
      });
    } catch {
      return dateString;
    }
  };

  const isDesktop = windowWidth >= 900;

  if (loading) {
    return (
      <View style={styles.loadingContainer}>
        <ActivityIndicator size="large" color={colors.primary} />
        <Text style={styles.loadingText}>Loading exams...</Text>
      </View>
    );
  }

  return (
    <AdminLayout title="Questions">
      {/* Filters and Search */}
      <View style={styles.filters}>
        <View style={styles.searchContainer}>
          <Ionicons name="search" size={20} color="#6b7280" style={styles.searchIcon} />
          <TextInput
            style={styles.searchInput}
            placeholder="Search exams..."
            value={searchQuery}
            onChangeText={setSearchQuery}
          />
        </View>
        <ScrollView horizontal showsHorizontalScrollIndicator={false} style={styles.statusFilters}>
          {(['All', 'Active', 'Draft', 'Archived'] as const).map(status => (
            <TouchableOpacity
              key={status}
              style={[styles.statusFilter, filterStatus === status && styles.activeFilter]}
              onPress={() => setFilterStatus(status)}
            >
              <Text style={[styles.statusFilterText, filterStatus === status && styles.activeFilterText]}>
                {status}
              </Text>
            </TouchableOpacity>
          ))}
        </ScrollView>
      </View>

      <View style={isDesktop ? styles.desktopContainer : styles.mobileContainer}>
        <FlatList
          data={filteredExams}
          keyExtractor={exam => exam.id}
          numColumns={isDesktop ? 2 : 1}
          key={isDesktop ? 'desktop' : 'mobile'} // Force re-render when switching layouts
          ListEmptyComponent={
            <GlassCard style={[styles.emptyCard, isDesktop && styles.emptyCardDesktop]}>
              <Ionicons name="document-text-outline" size={48} color="#9ca3af" />
              <Text style={styles.emptyText}>
                {searchQuery || filterStatus !== 'All' 
                  ? 'No exams found matching your criteria.' 
                  : 'No exams created yet.'}
              </Text>
              <Text style={styles.emptySubtext}>
                {searchQuery || filterStatus !== 'All' 
                  ? 'Try adjusting your search or filters.' 
                  : 'Create your first exam to get started.'}
              </Text>
              {!searchQuery && filterStatus === 'All' && (
                <GlassButton 
                  title="Create New Exam" 
                  onPress={handleCreateNewExam}
                  style={styles.createExamButton}
                />
              )}
            </GlassCard>
          }
          renderItem={({ item: exam }) => (
            <GlassCard
              key={exam.id}
              style={[
                styles.examCard,
                isDesktop ? styles.examCardDesktop : styles.examCardMobile
              ]}
            >
              {!isDesktop ? (
                // Mobile view: Manage button at top left, then exam info
                <>
                  <View style={{ alignItems: 'flex-start', marginBottom: 8 }}>
                    <TouchableOpacity
                      style={styles.manageButton}
                      onPress={() => handleManageQuestions(exam.id)}
                    >
                      <Ionicons name="list-circle-outline" size={20} color="#3B82F6" />
                      <Text style={styles.manageButtonText}>Manage Questions</Text>
                    </TouchableOpacity>
                  </View>
                  <View style={styles.examInfo}>
                    <Text style={styles.examTitle}>{exam.title}</Text>
                    <Text style={styles.examSubject}>{exam.subject}</Text>
                    <View style={styles.examMeta}>
                      <View style={[styles.statusBadge, { backgroundColor: getStatusColor(exam.status) }]}> 
                        <Text style={styles.statusText}>{exam.status}</Text>
                      </View>
                      <View style={[styles.difficultyBadge, { backgroundColor: getDifficultyColor(exam.difficulty) }]}> 
                        <Text style={styles.difficultyText}>{exam.difficulty}</Text>
                      </View>
                      <Text style={styles.examMetaText}>{exam.duration} mins</Text>
                      <Text style={styles.examMetaText}>{exam.questions} questions</Text>
                    </View>
                  </View>
                </>
              ) : (
                // Desktop view: original layout
                <View style={styles.examHeader}>
                  <View style={styles.examInfo}>
                    <Text style={styles.examTitle}>{exam.title}</Text>
                    <Text style={styles.examSubject}>{exam.subject}</Text>
                    <View style={styles.examMeta}>
                      <View style={[styles.statusBadge, { backgroundColor: getStatusColor(exam.status) }]}> 
                        <Text style={styles.statusText}>{exam.status}</Text>
                      </View>
                      <View style={[styles.difficultyBadge, { backgroundColor: getDifficultyColor(exam.difficulty) }]}> 
                        <Text style={styles.difficultyText}>{exam.difficulty}</Text>
                      </View>
                      <Text style={styles.examMetaText}>{exam.duration} mins</Text>
                      <Text style={styles.examMetaText}>{exam.questions} questions</Text>
                    </View>
                  </View>
                  <View style={styles.examActions}>
                    <TouchableOpacity
                      style={styles.manageButton}
                      onPress={() => handleManageQuestions(exam.id)}
                    >
                      <Ionicons name="list-circle-outline" size={20} color="#3B82F6" />
                      <Text style={styles.manageButtonText}>Manage Questions</Text>
                    </TouchableOpacity>
                  </View>
                </View>
              )}
              <View style={styles.examFooter}>
                <Text style={styles.examDate}>Created: {formatDate(exam.createdAt)}</Text>
                <Text style={styles.examDate}>Updated: {formatDate(exam.updatedAt)}</Text>
              </View>
            </GlassCard>
          )}
          contentContainerStyle={isDesktop ? styles.desktopListContent : styles.mobileListContent}
          columnWrapperStyle={isDesktop ? styles.desktopRow : undefined}
          showsVerticalScrollIndicator={false}
        />
      </View>
    </AdminLayout>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#f8fafc',
  },
  loadingContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#f8fafc',
  },
  loadingText: {
    marginTop: 10,
    fontSize: 16,
    color: '#6b7280',
  },
  header: {
    padding: 20,
    paddingTop: 40,
  },
  headerTop: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginBottom: 8,
  },
  backButton: {
    padding: 4,
  },
  title: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#1f2937',
    flex: 1,
    textAlign: 'center',
  },
  subtitle: {
    fontSize: 16,
    color: '#6b7280',
    textAlign: 'center',
  },
  filters: {
    paddingHorizontal: 20,
    marginBottom: 20,
  },
  searchContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: 'white',
    borderRadius: 8,
    paddingHorizontal: 12,
    marginBottom: 12,
    borderWidth: 1,
    borderColor: '#e5e7eb',
  },
  searchIcon: {
    marginRight: 8,
  },
  searchInput: {
    flex: 1,
    paddingVertical: 12,
    fontSize: 16,
    color: '#1f2937',
  },
  statusFilters: {
    marginBottom: 8,
  },
  statusFilter: {
    paddingHorizontal: 16,
    paddingVertical: 8,
    borderRadius: 20,
    backgroundColor: '#f3f4f6',
    marginRight: 8,
  },
  activeFilter: {
    backgroundColor: '#282FFB',
  },
  statusFilterText: {
    fontSize: 14,
    fontWeight: '500',
    color: '#6b7280',
  },
  activeFilterText: {
    color: 'white',
  },
  // Container styles
  mobileContainer: {
    flex: 1,
    paddingHorizontal: 20,
  },
  desktopContainer: {
    flex: 1,
    alignItems: 'center',
    paddingHorizontal: 20,
  },
  // List content styles
  mobileListContent: {
    paddingBottom: 20,
  },
  desktopListContent: {
    width: '100%',
    maxWidth: 1200,
    paddingBottom: 20,
  },
  desktopRow: {
    justifyContent: 'space-between',
    paddingHorizontal: 0,
  },
  // Empty card styles
  emptyCard: {
    padding: 40,
    alignItems: 'center',
    backgroundColor: 'rgba(255,255,255,0.85)',
  },
  emptyCardDesktop: {
    maxWidth: 600,
    alignSelf: 'center',
  },
  emptyText: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#6b7280',
    marginTop: 16,
    marginBottom: 8,
    textAlign: 'center',
  },
  emptySubtext: {
    fontSize: 14,
    color: '#9ca3af',
    textAlign: 'center',
    marginBottom: 20,
  },
  createExamButton: {
    marginTop: 10,
    backgroundColor: '#282FFB',
  },
  // Exam card styles
  examCard: {
    backgroundColor: 'rgba(255,255,255,0.85)',
    shadowColor: colors.primary,
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.08,
    shadowRadius: 8,
    elevation: 3,
  },
  examCardMobile: {
    marginBottom: 16,
    padding: 16,
    width: '100%',
    alignSelf: 'stretch',
  },
  examCardDesktop: {
    marginBottom: 20,
    padding: 24,
    width: '48%',
    minHeight: 200,
  },
  examHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'flex-start',
    marginBottom: 12,
  },
  examInfo: {
    flex: 1,
    marginRight: 12,
  },
  examTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#1f2937',
    marginBottom: 4,
    flexShrink: 1,
    flexWrap: 'wrap',
    width: '100%',
  },
  examSubject: {
    fontSize: 14,
    color: '#6b7280',
    marginBottom: 8,
  },
  examMeta: {
    flexDirection: 'row',
    alignItems: 'center',
    flexWrap: 'wrap',
  },
  statusBadge: {
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 12,
    marginRight: 8,
    marginBottom: 4,
  },
  statusText: {
    fontSize: 12,
    fontWeight: '500',
    color: 'white',
  },
  difficultyBadge: {
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 12,
    marginRight: 8,
    marginBottom: 4,
  },
  difficultyText: {
    fontSize: 12,
    fontWeight: '500',
    color: 'white',
  },
  examMetaText: {
    fontSize: 12,
    color: '#6b7280',
    marginRight: 8,
    marginBottom: 4,
  },
  examActions: {
    alignItems: 'flex-end',
  },
  manageButton: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#eff6ff',
    paddingHorizontal: 12,
    paddingVertical: 8,
    borderRadius: 6,
    borderWidth: 1,
    borderColor: '#3b82f6',
  },
  manageButtonText: {
    fontSize: 14,
    fontWeight: '500',
    color: '#3b82f6',
    marginLeft: 4,
  },
  examFooter: {
    borderTopWidth: 1,
    borderTopColor: '#e5e7eb',
    paddingTop: 12,
    flexDirection: 'row',
    justifyContent: 'space-between',
  },
  examDate: {
    fontSize: 12,
    color: '#9ca3af',
  },
});

export default QuestionsPage;