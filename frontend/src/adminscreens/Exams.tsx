import React, { useState, useEffect } from 'react';
import { View, Text, StyleSheet, FlatList, TouchableOpacity, Modal, TextInput, Alert, Platform, ScrollView, Switch, useWindowDimensions } from 'react-native';
import { useNavigation } from '@react-navigation/native';
import { Ionicons } from '@expo/vector-icons';
import { colors } from '../theme';

import AdminLayout from './AdminLayout';

// Exam type definition
import api from '../services/api';

// Exam type definition
const getAllExams = async (): Promise<any[]> => {
  try {
    const { data } = await api.get('/exams');
    // Map _id to id for frontend compatibility
    return data.map((exam: any) => ({ ...exam, id: exam._id || exam.id }));
  } catch (error) {
    console.error('Failed to get exams:', error);
    return []; // Return empty on error
  }
};

const addExam = async (exam: any): Promise<any> => {
  try {
    const { data } = await api.post('/exams', exam);
    return data;
  } catch (error) {
    console.error('Failed to add exam:', error);
    throw error;
  }
};

const updateExam = async (examId: string, updates: any): Promise<any> => {
  try {
    const { data } = await api.put(`/exams/${examId}`, updates);
    return data;
  } catch (error) {
    console.error('Failed to update exam:', error);
    throw error;
  }
};

const deleteExam = async (examId: string): Promise<boolean> => {
  try {
    await api.delete(`/exams/${examId}`);
    return true;
  } catch (error) {
    console.error('Failed to delete exam:', error);
    return false;
  }
};

const Exams = () => {
  const navigation = useNavigation<any>();
  const [exams, setExams] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [showModal, setShowModal] = useState(false);
  const [editingExam, setEditingExam] = useState<any>(null);
  const [statusFilter, setStatusFilter] = useState<'All' | 'Active' | 'Archived'>('All');
  const [searchQuery, setSearchQuery] = useState(''); // add search state
  const [formData, setFormData] = useState({
    title: '',
    subject: '',
    difficulty: 'Medium',
    duration: '',
    questions: '',
    description: '',
    category: '',
    passingScore: '',
    maxAttempts: '',
    isPublic: true,
    randomizeQuestions: false,
    showResults: true,
    allowReview: true,
    timeLimit: true,
    instructions: '',
  });
  const { width: windowWidth } = useWindowDimensions();
  const numColumns = windowWidth >= 900 ? 2 : 1;

  useEffect(() => {
    loadExams();
  }, []);

  const loadExams = async () => {
    setLoading(true);
    try {
      const allExams = await getAllExams();
      setExams(allExams); // Keep order as is
    } catch (error) {
      Alert.alert('Error', 'Failed to load exams.');
    } finally {
      setLoading(false);
    }
  };

  const openAddModal = () => {
    setEditingExam(null);
    setFormData({
      title: '',
      subject: '',
      difficulty: 'Medium',
      duration: '',
      questions: '',
      description: '',
      category: '',
      passingScore: '',
      maxAttempts: '',
      isPublic: true,
      randomizeQuestions: false,
      showResults: true,
      allowReview: true,
      timeLimit: true,
      instructions: '',
    });
    setShowModal(true);
  };

  const openEditModal = (exam: any) => {
    setEditingExam(exam);
    setFormData({
      title: exam.title,
      subject: exam.subject,
      difficulty: exam.difficulty,
      duration: exam.duration.toString(),
      questions: exam.questions.toString(),
      description: exam.description || '',
      category: exam.category || '',
      passingScore: exam.passingScore?.toString() || '',
      maxAttempts: exam.maxAttempts?.toString() || '',
      isPublic: exam.isPublic !== undefined ? exam.isPublic : true,
      randomizeQuestions: exam.randomizeQuestions || false,
      showResults: exam.showResults !== undefined ? exam.showResults : true,
      allowReview: exam.allowReview !== undefined ? exam.allowReview : true,
      timeLimit: exam.timeLimit !== undefined ? exam.timeLimit : true,
      instructions: exam.instructions || '',
    });
    setShowModal(true);
  };

  const closeModal = () => {
    setShowModal(false);
    setEditingExam(null);
    setFormData({
      title: '',
      subject: '',
      difficulty: 'Medium',
      duration: '',
      questions: '',
      description: '',
      category: '',
      passingScore: '',
      maxAttempts: '',
      isPublic: true,
      randomizeQuestions: false,
      showResults: true,
      allowReview: true,
      timeLimit: true,
      instructions: '',
    });
  };

  const handleSave = async () => {
    if (!formData.title || !formData.subject || !formData.duration || !formData.questions) {
      Alert.alert('Error', 'Please fill in all required fields');
      return;
    }
    try {
      const examData = {
        title: formData.title,
        subject: formData.subject,
        difficulty: formData.difficulty,
        duration: parseInt(formData.duration),
        questions: parseInt(formData.questions),
        description: formData.description,
        category: formData.category,
        passingScore: formData.passingScore ? parseInt(formData.passingScore) : null,
        maxAttempts: formData.maxAttempts ? parseInt(formData.maxAttempts) : null,
        isPublic: formData.isPublic,
        randomizeQuestions: formData.randomizeQuestions,
        showResults: formData.showResults,
        allowReview: formData.allowReview,
        timeLimit: formData.timeLimit,
        instructions: formData.instructions,
        status: 'Draft',
        createdBy: '', // Set this if you have a current admin user
      };

      if (editingExam) {
        await updateExam(editingExam.id, examData);
        Alert.alert('Success', 'Exam updated successfully!');
      } else {
        await addExam(examData);
        Alert.alert('Success', 'Exam added successfully!');
      }
      closeModal();
      loadExams();
    } catch (error) {
      Alert.alert('Error', 'Failed to save exam.');
    }
  };

  const handleDelete = async (id: string) => {
    if (Platform.OS === 'web') {
      if (window.confirm('Are you sure you want to delete this exam?')) {
        try {
          await deleteExam(id);
          loadExams();
        } catch {
          alert('Failed to delete exam.');
        }
      }
    } else {
      Alert.alert('Delete Exam', 'Are you sure you want to delete this exam?', [
        { text: 'Cancel', style: 'cancel' },
        {
          text: 'Delete', style: 'destructive', onPress: async () => {
            try {
              await deleteExam(id);
              loadExams();
            } catch {
              Alert.alert('Error', 'Failed to delete exam.');
            }
          }
        }
      ]);
    }
  };

  // Toggle status between Active and Archived
  const handleToggleStatus = async (exam: any) => {
    const newStatus = exam.status === 'Active' ? 'Archived' : 'Active';
    await updateExam(exam.id, { status: newStatus });
    loadExams();
  };

  // Filter exams by status and search
  const filteredExams = exams.filter(exam =>
    (statusFilter === 'All' ? true : exam.status === statusFilter) &&
    (
      (exam.title && exam.title.toLowerCase().includes(searchQuery.toLowerCase())) ||
      (exam.subject && exam.subject.toLowerCase().includes(searchQuery.toLowerCase()))
    )
  );

  const getDifficultyColor = (difficulty: string) => {
    switch (difficulty) {
      case 'Easy': return '#10B981';
      case 'Medium': return '#F59E0B';
      case 'Hard': return '#EF4444';
      default: return '#6B7280';
    }
  };

  const renderExam = ({ item }: { item: any }) => (
    <View style={[styles.examCard, numColumns > 1 ? styles.examCardMulti : styles.examCardSingle]}>
      <View style={styles.examHeader}>
        <View style={styles.examTitleRow}>
          <Text style={styles.examTitle}>{item.title}</Text>
          <View style={[styles.statusBadge, { backgroundColor: getDifficultyColor(item.difficulty) }]}>
            <Text style={styles.statusText}>{item.difficulty}</Text>
          </View>
        </View>
        <Text style={styles.examSubject}>{item.subject}</Text>
        {item.description && <Text style={styles.examDescription}>{item.description}</Text>}
      </View>
      <View style={styles.examStats}>
        <View style={styles.statItem}>
          <Ionicons name="time-outline" size={16} color={colors.textSecondary} />
          <Text style={styles.statText}>{item.duration} min</Text>
        </View>
        <View style={styles.statItem}>
          <Ionicons name="help-circle-outline" size={16} color={colors.textSecondary} />
          <Text style={styles.statText}>{item.totalQuestions || 0} questions</Text>
        </View>
        {item.passingScore && (
          <View style={styles.statItem}>
            <Ionicons name="checkmark-circle-outline" size={16} color={colors.textSecondary} />
            <Text style={styles.statText}>{item.passingScore}% to pass</Text>
          </View>
        )}
      </View>

      {/* Manage Questions Button */}
      <TouchableOpacity
        style={styles.manageQuestionsBtn}
        onPress={() => navigation.navigate('ManageQuestions', { examId: item.id })}
      >
        <Ionicons name="list-outline" size={18} color="#282FFB" />
        <Text style={styles.manageQuestionsBtnText}>Manage Questions ({item.totalQuestions || 0})</Text>
      </TouchableOpacity>
      <View style={styles.examFooter}>
        <View style={styles.examMeta}>
          <Text style={styles.metaText}>Created: {item.createdAt}</Text>
          {item.isPublic && (
            <View style={styles.publicBadge}>
              <Ionicons name="globe-outline" size={12} color="#059669" />
              <Text style={styles.publicText}>Public</Text>
            </View>
          )}
          {/* Status badge */}
          <View style={[styles.statusBadge, { backgroundColor: item.status === 'Active' ? '#10B981' : '#6B7280', marginLeft: 8 }]}>
            <Text style={styles.statusText}>{item.status}</Text>
          </View>
        </View>
        <View style={styles.actions}>
          <TouchableOpacity onPress={() => handleToggleStatus(item)} style={[styles.actionBtn, { backgroundColor: item.status === 'Active' ? '#6B7280' : '#10B981' }]}>
            <Ionicons name={item.status === 'Active' ? 'archive-outline' : 'checkmark-circle-outline'} size={18} color="#fff" />
          </TouchableOpacity>
          <TouchableOpacity onPress={() => openEditModal(item)} style={[styles.actionBtn, styles.editBtn]}>
            <Ionicons name="pencil" size={18} color="#fff" />
          </TouchableOpacity>
          <TouchableOpacity onPress={() => { console.log('Delete pressed', item.id); handleDelete(item.id); }} style={[styles.actionBtn, styles.deleteBtn, { minWidth: 36, minHeight: 36 }]}>
            <Ionicons name="trash" size={18} color="#fff" />
          </TouchableOpacity>
        </View>
      </View>
    </View>
  );

  const renderFormSection = (title: string, icon: string, children: React.ReactNode) => (
    <View style={styles.formSection}>
      <View style={styles.sectionHeader}>
        <Ionicons name={icon as any} size={20} color={colors.primary} />
        <Text style={styles.sectionTitle}>{title}</Text>
      </View>
      {children}
    </View>
  );

  const renderSwitchRow = (label: string, value: boolean, onValueChange: (value: boolean) => void, description?: string) => (
    <View style={styles.switchRow}>
      <View style={styles.switchLabel}>
        <Text style={styles.switchText}>{label}</Text>
        {description && <Text style={styles.switchDescription}>{description}</Text>}
      </View>
      <Switch
        value={value}
        onValueChange={onValueChange}
        trackColor={{ false: '#E5E7EB', true: colors.primary + '40' }}
        thumbColor={value ? colors.primary : '#9CA3AF'}
      />
    </View>
  );

  // Modern search bar UI
  const renderSearchBar = () => (
    <View style={{
      flexDirection: 'row',
      alignItems: 'center',
      backgroundColor: '#f3f4f6',
      borderRadius: 8,
      marginVertical: 16,
      paddingHorizontal: 12,
      marginHorizontal: numColumns === 1 ? 8 : 0,
    }}>
      <Ionicons name="search-outline" size={20} color="#9ca3af" style={{ marginRight: 8 }} />
      <TextInput
        placeholder="Search exams..."
        style={{ flex: 1, paddingVertical: 10, fontSize: 14, color: '#1f2937' }}
        value={searchQuery}
        onChangeText={setSearchQuery}
        placeholderTextColor="#9ca3af"
      />
    </View>
  );

  return (
    <AdminLayout title="Exams">
      {renderSearchBar()}
      {/* Status Filter */}
      <View style={{ flexDirection: 'row', marginBottom: 16, gap: 8, paddingVertical: 12, alignItems: 'center' }}>
        {['All', 'Active', 'Archived'].map((status) => (
          <TouchableOpacity
            key={status}
            style={{
              backgroundColor: statusFilter === status ? '#282FFB' : '#f3f4f6',
              paddingHorizontal: 16,
              paddingVertical: 8,
              borderRadius: 20,
              marginRight: 8,
            }}
            onPress={() => setStatusFilter(status as 'All' | 'Active' | 'Archived')}
          >
            <Text style={{ color: statusFilter === status ? '#fff' : '#374151', fontWeight: 'bold' }}>{status}</Text>
          </TouchableOpacity>
        ))}
      </View>
      {/* Divider with Total Exams and New Exam button */}
      <View style={{
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'space-between',
        borderBottomWidth: 1,
        borderBottomColor: '#E5E7EB',
        paddingBottom: 12,
        marginBottom: 16,
      }}>
        <Text style={{ fontSize: 16, color: '#374151', fontWeight: '500' }}>
          Total Exams: {filteredExams.length}
        </Text>
        <TouchableOpacity style={[styles.addBtn, { backgroundColor: '#282FFB', shadowColor: '#282FFB' }]} onPress={openAddModal}>
          <Ionicons name="add" size={20} color="#fff" />
          <Text style={styles.addBtnText}>New Exam</Text>
        </TouchableOpacity>
      </View>
      <FlatList
        data={filteredExams}
        keyExtractor={(item: any) => item.id}
        renderItem={renderExam}
        refreshing={loading}
        onRefresh={loadExams}
        contentContainerStyle={[styles.listContainer, numColumns > 1 ? { paddingHorizontal: 12 } : {}]}
        showsVerticalScrollIndicator={false}
        ListEmptyComponent={
          !loading ? (
            <View style={styles.emptyState}>
              <Ionicons name="document-text-outline" size={64} color={colors.textSecondary} />
              <Text style={styles.emptyTitle}>No exams yet</Text>
              <Text style={styles.emptyText}>Create your first exam to get started</Text>
            </View>
          ) : null
        }
        numColumns={numColumns}
        key={numColumns} // force remount on column change
        columnWrapperStyle={numColumns > 1 ? { justifyContent: 'flex-start' } : undefined}
      />
      <Modal
        visible={showModal}
        animationType="slide"
        transparent={true}
        onRequestClose={closeModal}
      >
        <View style={styles.modalOverlay}>
          <View style={styles.modalContent}>
            <View style={styles.modalHeader}>
              <Text style={styles.modalTitle}>
                {editingExam ? 'Edit Exam' : 'Create New Exam'}
              </Text>
              <TouchableOpacity onPress={closeModal} style={styles.closeBtn}>
                <Ionicons name="close" size={24} color={colors.textSecondary} />
              </TouchableOpacity>
            </View>
            <ScrollView style={styles.formContainer} showsVerticalScrollIndicator={false}>
              {renderFormSection('Basic Information', 'information-circle-outline', (
                <>
                  <View style={styles.inputGroup}>
                    <Text style={styles.label}>Title *</Text>
                    <TextInput
                      style={styles.input}
                      placeholder="Enter exam title"
                      value={formData.title}
                      onChangeText={t => setFormData({ ...formData, title: t })}
                    />
                  </View>

                  <View style={styles.inputGroup}>
                    <Text style={styles.label}>Subject *</Text>
                    <TextInput
                      style={styles.input}
                      placeholder="Enter subject"
                      value={formData.subject}
                      onChangeText={t => setFormData({ ...formData, subject: t })}
                    />
                  </View>

                  <View style={styles.inputGroup}>
                    <Text style={styles.label}>Description</Text>
                    <TextInput
                      style={[styles.input, styles.textArea]}
                      placeholder="Brief description of the exam"
                      value={formData.description}
                      onChangeText={t => setFormData({ ...formData, description: t })}
                      multiline
                      numberOfLines={3}
                    />
                  </View>

                  <View style={styles.inputGroup}>
                    <Text style={styles.label}>Category</Text>
                    <TextInput
                      style={styles.input}
                      placeholder="e.g., Mathematics, Science, History"
                      value={formData.category}
                      onChangeText={t => setFormData({ ...formData, category: t })}
                    />
                  </View>
                </>
              ))}

              {renderFormSection('Exam Configuration', 'settings-outline', (
                <>
                  <View style={styles.row}>
                    <View style={[styles.inputGroup, styles.halfWidth]}>
                      <Text style={styles.label}>Duration (minutes) *</Text>
                      <TextInput
                        style={styles.input}
                        placeholder="60"
                        value={formData.duration}
                        onChangeText={t => setFormData({ ...formData, duration: t.replace(/[^0-9]/g, '') })}
                        keyboardType="numeric"
                      />
                    </View>
                    <View style={[styles.inputGroup, styles.halfWidth]}>
                      <Text style={styles.label}>Questions *</Text>
                      <TextInput
                        style={styles.input}
                        placeholder="25"
                        value={formData.questions}
                        onChangeText={t => setFormData({ ...formData, questions: t.replace(/[^0-9]/g, '') })}
                        keyboardType="numeric"
                      />
                    </View>
                  </View>

                  <View style={styles.row}>
                    <View style={[styles.inputGroup, styles.halfWidth]}>
                      <Text style={styles.label}>Passing Score (%)</Text>
                      <TextInput
                        style={styles.input}
                        placeholder="70"
                        value={formData.passingScore}
                        onChangeText={t => setFormData({ ...formData, passingScore: t.replace(/[^0-9]/g, '') })}
                        keyboardType="numeric"
                      />
                    </View>
                    <View style={[styles.inputGroup, styles.halfWidth]}>
                      <Text style={styles.label}>Max Attempts</Text>
                      <TextInput
                        style={styles.input}
                        placeholder="3"
                        value={formData.maxAttempts}
                        onChangeText={t => setFormData({ ...formData, maxAttempts: t.replace(/[^0-9]/g, '') })}
                        keyboardType="numeric"
                      />
                    </View>
                  </View>

                  <View style={styles.inputGroup}>
                    <Text style={styles.label}>Difficulty Level</Text>
                    <View style={styles.difficultyRow}>
                      {['Easy', 'Medium', 'Hard'].map(diff => (
                        <TouchableOpacity
                          key={diff}
                          style={[
                            styles.diffBtn,
                            formData.difficulty === diff && styles.diffBtnActive,
                            { borderColor: getDifficultyColor(diff) }
                          ]}
                          onPress={() => setFormData({ ...formData, difficulty: diff })}
                        >
                          <Text style={[
                            styles.diffBtnText,
                            formData.difficulty === diff && { color: '#fff' }
                          ]}>
                            {diff}
                          </Text>
                        </TouchableOpacity>
                      ))}
                    </View>
                  </View>
                </>
              ))}

              {renderFormSection('Instructions', 'list-outline', (
                <View style={styles.inputGroup}>
                  <Text style={styles.label}>Exam Instructions</Text>
                  <TextInput
                    style={[styles.input, styles.textArea]}
                    placeholder="Enter detailed instructions for students..."
                    value={formData.instructions}
                    onChangeText={t => setFormData({ ...formData, instructions: t })}
                    multiline
                    numberOfLines={4}
                  />
                </View>
              ))}

              {renderFormSection('Settings', 'cog-outline', (
                <>
                  {renderSwitchRow(
                    'Public Exam',
                    formData.isPublic,
                    (value) => setFormData({ ...formData, isPublic: value }),
                    'Allow all students to access this exam'
                  )}
                  {renderSwitchRow(
                    'Randomize Questions',
                    formData.randomizeQuestions,
                    (value) => setFormData({ ...formData, randomizeQuestions: value }),
                    'Present questions in random order'
                  )}
                  {renderSwitchRow(
                    'Show Results',
                    formData.showResults,
                    (value) => setFormData({ ...formData, showResults: value }),
                    'Display results immediately after completion'
                  )}
                  {renderSwitchRow(
                    'Allow Review',
                    formData.allowReview,
                    (value) => setFormData({ ...formData, allowReview: value }),
                    'Students can review their answers'
                  )}
                  {renderSwitchRow(
                    'Time Limit',
                    formData.timeLimit,
                    (value) => setFormData({ ...formData, timeLimit: value }),
                    'Enforce the duration limit'
                  )}
                </>
              ))}
            </ScrollView>

            <View style={styles.modalActions}>
              <TouchableOpacity style={styles.cancelBtn} onPress={closeModal}>
                <Text style={styles.cancelBtnText}>Cancel</Text>
              </TouchableOpacity>
              <TouchableOpacity style={styles.saveBtn} onPress={handleSave}>
                <Text style={styles.saveBtnText}>
                  {editingExam ? 'Update Exam' : 'Create Exam'}
                </Text>
              </TouchableOpacity>
            </View>
          </View>
        </View>
      </Modal>
    </AdminLayout>
  );
};

const styles = StyleSheet.create({
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    padding: 20,
    paddingTop: Platform.OS === 'ios' ? 40 : 20,
    backgroundColor: '#FFFFFF',
    borderBottomWidth: 1,
    borderBottomColor: '#E5E7EB',
  },
  headerTitle: {
    fontSize: 28,
    fontWeight: 'bold',
    color: colors.primary,
  },
  headerSubtitle: {
    fontSize: 14,
    color: colors.textSecondary,
    marginTop: 2,
  },
  addBtn: {
    flexDirection: 'row',
    backgroundColor: '#282FFB',
    paddingHorizontal: 20,
    paddingVertical: 12,
    borderRadius: 12,
    alignItems: 'center',
    shadowColor: '#282FFB',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.3,
    shadowRadius: 8,
    elevation: 5,
  },
  addBtnText: {
    color: 'white',
    fontWeight: '600',
    marginLeft: 8,
    fontSize: 16,
  },
  listContainer: {
    paddingHorizontal: 20,
    paddingBottom: 20,
    backgroundColor: '#F8FAFC',
  },
  examCard: {
    backgroundColor: 'white',
    borderRadius: 16,
    padding: 20,
    marginBottom: 16,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 8,
    elevation: 3,
    flex: 1,
    minWidth: 0,
    maxWidth: '100%',
  },
  examCardSingle: {
    width: '100%',
    marginRight: 0,
  },
  examCardMulti: {
    width: '48%',
    marginRight: '2%',
    alignSelf: 'flex-start',
    maxWidth: '48%',
  },
  examHeader: {
    marginBottom: 16,
  },
  examTitleRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'flex-start',
    marginBottom: 8,
  },
  examTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    color: colors.primary,
    flex: 1,
    marginRight: 12,
  },
  statusBadge: {
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 20,
    alignSelf: 'flex-start', // फक्त शब्द पुरतीच bar
  },
  statusText: {
    color: '#fff',
    fontSize: 12,
    fontWeight: '600',
  },
  examSubject: {
    fontSize: 16,
    color: colors.textSecondary,
    fontWeight: '500',
    marginBottom: 4,
  },
  examDescription: {
    fontSize: 14,
    color: colors.textSecondary,
    lineHeight: 20,
  },
  examStats: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    marginBottom: 16,
  },
  statItem: {
    flexDirection: 'row',
    alignItems: 'center',
    marginRight: 20,
    marginBottom: 8,
  },
  statText: {
    fontSize: 14,
    color: colors.textSecondary,
    marginLeft: 6,
  },
  examFooter: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    borderTopWidth: 1,
    borderTopColor: '#E5E7EB',
    paddingTop: 16,
  },
  examMeta: {
    flex: 1,
  },
  metaText: {
    fontSize: 12,
    color: colors.textSecondary,
    marginBottom: 4,
  },
  publicBadge: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  publicText: {
    fontSize: 12,
    color: '#059669',
    marginLeft: 4,
    fontWeight: '500',
  },
  actions: {
    flexDirection: 'row',
  },
  actionBtn: {
    width: 36,
    height: 36,
    borderRadius: 18,
    justifyContent: 'center',
    alignItems: 'center',
    marginLeft: 8,
  },
  editBtn: {
    backgroundColor: '#282FFB',
  },
  deleteBtn: {
    backgroundColor: '#EF4444',
  },
  manageQuestionsBtn: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: '#EEF2FF',
    paddingVertical: 12,
    paddingHorizontal: 16,
    borderRadius: 10,
    marginBottom: 16,
    borderWidth: 1,
    borderColor: '#C7D2FE',
  },
  manageQuestionsBtnText: {
    color: '#282FFB',
    fontSize: 14,
    fontWeight: '600',
    marginLeft: 8,
  },
  emptyState: {
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: 60,
  },
  emptyTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    color: colors.textSecondary,
    marginTop: 16,
    marginBottom: 8,
  },
  emptyText: {
    fontSize: 14,
    color: colors.textSecondary,
    textAlign: 'center',
  },
  modalOverlay: {
    flex: 1,
    backgroundColor: 'rgba(0,0,0,0.5)',
    justifyContent: 'center',
    alignItems: 'center',
  },
  modalContent: {
    backgroundColor: 'white',
    borderRadius: 20,
    width: '95%',
    maxWidth: 500,
    maxHeight: '90%',
    overflow: 'hidden',
  },
  modalHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    padding: 20,
    borderBottomWidth: 1,
    borderBottomColor: '#E5E7EB',
  },
  modalTitle: {
    fontSize: 20,
    fontWeight: 'bold',
    color: colors.primary,
  },
  closeBtn: {
    padding: 4,
  },
  formContainer: {
    padding: 20,
  },
  formSection: {
    marginBottom: 24,
  },
  sectionHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 16,
  },
  sectionTitle: {
    fontSize: 16,
    fontWeight: '600',
    color: colors.primary,
    marginLeft: 8,
  },
  inputGroup: {
    marginBottom: 16,
  },
  label: {
    fontSize: 14,
    fontWeight: '500',
    color: colors.text,
    marginBottom: 8,
  },
  input: {
    borderWidth: 1,
    borderColor: '#D1D5DB',
    borderRadius: 12,
    padding: 16,
    fontSize: 16,
    color: colors.text,
    backgroundColor: '#F9FAFB',
  },
  textArea: {
    height: 80,
    textAlignVertical: 'top',
  },
  row: {
    flexDirection: 'row',
    justifyContent: 'space-between',
  },
  halfWidth: {
    width: '48%',
  },
  difficultyRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
  },
  diffBtn: {
    flex: 1,
    paddingVertical: 12,
    borderRadius: 12,
    backgroundColor: '#F3F4F6',
    marginHorizontal: 4,
    alignItems: 'center',
    borderWidth: 2,
    borderColor: '#E5E7EB',
  },
  diffBtnActive: {
    backgroundColor: '#282FFB',
    borderColor: '#282FFB',
  },
  diffBtnText: {
    color: colors.textSecondary,
    fontWeight: '600',
    fontSize: 14,
  },
  switchRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingVertical: 12,
    borderBottomWidth: 1,
    borderBottomColor: '#F3F4F6',
  },
  switchLabel: {
    flex: 1,
    marginRight: 16,
  },
  switchText: {
    fontSize: 16,
    fontWeight: '500',
    color: colors.text,
  },
  switchDescription: {
    fontSize: 13,
    color: colors.textSecondary,
    marginTop: 2,
  },
  modalActions: {
    flexDirection: 'row',
    justifyContent: 'flex-end',
    padding: 20,
    borderTopWidth: 1,
    borderTopColor: '#E5E7EB',
    backgroundColor: '#F9FAFB',
  },
  cancelBtn: {
    paddingVertical: 12,
    paddingHorizontal: 24,
    borderRadius: 12,
    backgroundColor: '#E5E7EB',
    marginRight: 12,
  },
  cancelBtnText: {
    color: colors.textSecondary,
    fontWeight: '600',
    fontSize: 16,
  },
  saveBtn: {
    paddingVertical: 12,
    paddingHorizontal: 24,
    borderRadius: 12,
    backgroundColor: '#282FFB',
    shadowColor: '#282FFB',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.3,
    shadowRadius: 4,
    elevation: 3,
  },
  saveBtnText: {
    color: 'white',
    fontWeight: 'bold',
    fontSize: 16,
  },
});

export default Exams;